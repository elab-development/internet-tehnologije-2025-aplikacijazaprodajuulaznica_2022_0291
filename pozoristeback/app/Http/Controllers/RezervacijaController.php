<?php

namespace App\Http\Controllers;

use App\Models\Rezervacija;
use App\Models\Karta;
use App\Models\StavkaRezervacije;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use OpenApi\Attributes as OA;

class RezervacijaController extends Controller
{

    #[OA\Get(
        path: "/api/rezervacije",
        summary: "Prikaz svih rezervacija (Admin)",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Uspešno učitane sve rezervacije")]
    public function index()
    {
        // DODATO 'korisnik' u with niz
        // Takođe, sortiramo po ID-u opadajuće da nove rezervacije budu na vrhu
        $rezervacije = Rezervacija::with(['korisnik', 'stavke.karta'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($rezervacije);
    }


    #[OA\Post(
        path: "/api/rezervacije",
        summary: "Kreiranje nove rezervacije sa više karata",
        description: "Korisnik šalje niz ID-eva karata. Sistem proverava dostupnost, računa ukupnu cenu i kreira stavke.",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["korisnik_id", "nacin_placanja", "karte"],
            properties: [
                new OA\Property(property: "korisnik_id", type: "integer", example: 1),
                new OA\Property(property: "nacin_placanja", type: "string", enum: ["kartica", "na_blagajni", "vaucer"]),
                new OA\Property(
                    property: "karte", 
                    type: "array", 
                    items: new OA\Items(type: "integer"),
                    example: [10, 11, 12]
                )
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Rezervacija uspešno kreirana")]
    #[OA\Response(response: 400, description: "Neka od karata je već prodata")]
    #[OA\Response(response: 422, description: "Greška u validaciji")]
    public function store(Request $request)
    {
        // Validacija - mora da odgovara ENUM vrednostima iz baze
        $validator = Validator::make($request->all(), [
            'korisnik_id' => 'required|exists:korisnici,id',
            'nacin_placanja' => 'required|in:kartica,na_blagajni,vaucer',
            'karte' => 'required|array|min:1',
            'karte.*' => 'required|exists:karte,id' 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'poruka' => 'Validacija nije prošla.',
                'greske' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $ukupnaCena = 0;

            // 1. Kreiramo rezervaciju sa statusom 'kreirana'
            $rezervacija = Rezervacija::create([
                'korisnik_id' => $request->korisnik_id,
                'ukupna_cena' => 0, 
                'nacin_placanja' => $request->nacin_placanja,
                'status' => 'kreirana', 
                'datum_kreiranja' => now()
            ]);

            // 2. Prolazimo kroz niz ID-eva karata
            foreach ($request->karte as $kartaId) {
                // Koristimo find() da dobijemo JEDAN objekat
                $karta = Karta::find($kartaId);

                if (!$karta || $karta->prodata) {
                    throw new \Exception("Karta sa ID-em {$kartaId} je već prodata ili ne postoji.");
                }

                // 3. Kreiranje stavke
                StavkaRezervacije::create([
                    'rezervacija_id' => $rezervacija->id,
                    'karta_id' => $karta->id,
                    'cena_stavke' => $karta->cena,
                    'kolicina' => 1
                ]);

                // 4. Update statusa karte
                $karta->update(['prodata' => true]);
                $ukupnaCena += $karta->cena;
            }

            // 5. Finalni update rezervacije
            $rezervacija->update([
                'ukupna_cena' => $ukupnaCena,
                // 'status' => 'potvrdjena'
            ]);

            DB::commit();

            return response()->json([
                'poruka' => 'Rezervacija uspešno kreirana!',
                'podaci' => $rezervacija->load('stavke.karta')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'poruka' => 'Greška prilikom kreiranja rezervacije.',
                'greska' => $e->getMessage()
            ], 400);
        }
    }



    #[OA\Get(
        path: "/api/rezervacije/{id}",
        summary: "Prikaz detalja određene rezervacije",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function show($id)
    {
        $rezervacija = Rezervacija::with('stavke.karta')->find($id);
        return $rezervacija ? response()->json($rezervacija) : response()->json(['poruka' => 'Nema'], 404);
    }



    #[OA\Put(
        path: "/api/rezervacije/{id}/status",
        summary: "Promena statusa rezervacije (Admin)",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\RequestBody(
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "status", type: "string", example: "potvrdjena")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Status uspešno promenjen")]
    public function updateStatus(Request $request, $id)
    {
        $rezervacija = Rezervacija::find($id);
        if (!$rezervacija) return response()->json(['poruka' => 'Nema'], 404);

        $rezervacija->update(['status' => $request->status]);

        return response()->json(['poruka' => 'Status uspešno promenjen!']);
    }


    #[OA\Get(
        path: "/api/moje-rezervacije",
        summary: "Prikaz rezervacija ulogovanog korisnika",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Lista vaših rezervacija")]
    public function mojeRezervacije()
    {
        $rezervacije = Rezervacija::with(['stavke.karta.izvodjenje.predstava'])
            ->where('korisnik_id', auth()->id())
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($rezervacije);
    }



    #[OA\Put(
        path: "/api/rezervacije/{id}/potvrdi",
        summary: "Brza potvrda rezervacije od strane admina",
        description: "Postavlja status rezervacije direktno na 'potvrdjena'.",
        tags: ["Rezervacije"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Rezervacija uspešno potvrđena")]
    #[OA\Response(response: 404, description: "Rezervacija nije pronađena")]
    public function potvrdiRezervaciju($id)
    {
        $rezervacija = Rezervacija::find($id);
        if (!$rezervacija) return response()->json(['poruka' => 'Nema'], 404);

        $rezervacija->update(['status' => 'potvrdjena']);

        return response()->json(['poruka' => 'Admin je uspešno potvrdio rezervaciju!']);
    }
}


