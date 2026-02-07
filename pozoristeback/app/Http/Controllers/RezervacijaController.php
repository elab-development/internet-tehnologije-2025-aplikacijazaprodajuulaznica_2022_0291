<?php

namespace App\Http\Controllers;

use App\Models\Rezervacija;
use App\Models\Karta;
use App\Models\StavkaRezervacije;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class RezervacijaController extends Controller
{
    public function index()
    {
        // DODATO 'korisnik' u with niz
        // Takođe, sortiramo po ID-u opadajuće da nove rezervacije budu na vrhu
        $rezervacije = Rezervacija::with(['korisnik', 'stavke.karta'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($rezervacije);
    }
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

    public function show($id)
    {
        $rezervacija = Rezervacija::with('stavke.karta')->find($id);
        return $rezervacija ? response()->json($rezervacija) : response()->json(['poruka' => 'Nema'], 404);
    }

    public function updateStatus(Request $request, $id)
    {
        $rezervacija = Rezervacija::find($id);
        if (!$rezervacija) return response()->json(['poruka' => 'Nema'], 404);

        $rezervacija->update(['status' => $request->status]);

        return response()->json(['poruka' => 'Status uspešno promenjen!']);
    }

    public function mojeRezervacije()
    {
        $rezervacije = Rezervacija::with(['stavke.karta.izvodjenje.predstava'])
            ->where('korisnik_id', auth()->id())
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($rezervacije);
    }

    public function potvrdiRezervaciju($id)
    {
        $rezervacija = Rezervacija::find($id);
        if (!$rezervacija) return response()->json(['poruka' => 'Nema'], 404);

        $rezervacija->update(['status' => 'potvrdjena']);

        return response()->json(['poruka' => 'Admin je uspešno potvrdio rezervaciju!']);
    }
}



