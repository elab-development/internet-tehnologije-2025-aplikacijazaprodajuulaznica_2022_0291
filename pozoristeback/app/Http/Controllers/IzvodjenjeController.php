<?php

namespace App\Http\Controllers;

use App\Models\Izvodjenje;
use App\Models\Predstava;
use App\Models\Sala;
use App\Models\Karta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // Za transakcije

use OpenApi\Attributes as OA;

class IzvodjenjeController extends Controller
{

    #[OA\Get(
        path: "/api/izvodjenja",
        summary: "Prikaz svih planiranih izvođenja",
        tags: ["Izvođenja"]
    )]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function index()
    {
        $izvodjenja = Izvodjenje::with(['predstava', 'sala'])->get();
        return response()->json($izvodjenja);
    }

    /**
     * Kreira novo izvođenje i AUTOMATSKI generiše karte na osnovu kapaciteta sale.
     */


    #[OA\Post(
        path: "/api/izvodjenja",
        summary: "Kreiranje novog izvođenja i automatsko generisanje karata",
        description: "Kreira izvođenje i na osnovu kapaciteta sale generiše karte (npr. A1, A2...).",
        tags: ["Izvođenja"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["predstava_id", "sala_id", "datum_izvodjenja", "vreme_pocetka", "osnovna_cena"],
            properties: [
                new OA\Property(property: "predstava_id", type: "integer", example: 1),
                new OA\Property(property: "sala_id", type: "integer", example: 2),
                new OA\Property(property: "datum_izvodjenja", type: "string", format: "date", example: "2024-05-20"),
                new OA\Property(property: "vreme_pocetka", type: "string", example: "20:00"),
                new OA\Property(property: "osnovna_cena", type: "number", example: 1200)
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Izvođenje kreirano i karte generisane")]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'predstava_id'     => 'required|exists:predstave,id',
            'sala_id'          => 'required|exists:sale,id',
            'datum_izvodjenja' => 'required|date',
            'vreme_pocetka'    => 'required',
            'osnovna_cena'     => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // DB::transaction osigurava da ako generisanje karata pukne, 
        // ne ostane "prazno" izvođenje u bazi bez karata.
        return DB::transaction(function () use ($request) {
                $izvodjenje = Izvodjenje::create($request->all());
                $sala = Sala::findOrFail($request->sala_id);

                // Definišemo koliko sedišta ide u jedan red
                $sedistaPoRedu = 5; 
                $abeceda = ['A', 'B', 'C', 'D']; 

                for ($i = 0; $i < $sala->kapacitet; $i++) {
                    // floor(0/5) = 0 (Red A), floor(6/5) = 1 (Red B)...
                    $indeksReda = floor($i / $sedistaPoRedu);
                    $slovoReda = $abeceda[$indeksReda];
                    
                    // (0 % 5) + 1 = 1, (5 % 5) + 1 = 1 (novi red počinje od 1)
                    $brojURedu = ($i % $sedistaPoRedu) + 1;
                    
                    $oznakaSedista = $slovoReda . $brojURedu; // npr. A1, A2, B1...

                    Karta::create([
                        'izvodjenje_id' => $izvodjenje->id,
                        'broj_sedista'  => $oznakaSedista, 
                        'cena'          => $request->osnovna_cena,
                        'prodata'       => false
                    ]);
                }

                return response()->json([
                    'message' => "Uspešno! Generisano je {$sala->kapacitet} karata za salu: {$sala->naziv}.",
                    'data'    => $izvodjenje->load(['predstava', 'sala'])
                ], 201);
            });
    }


    #[OA\Get(
        path: "/api/izvodjenja/{id}",
        summary: "Detalji jednog izvođenja",
        tags: ["Izvođenja"]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function show($id)
    {
        $izvodjenje = Izvodjenje::with(['predstava', 'sala'])->find($id);

        if (!$izvodjenje) {
            return response()->json(['message' => 'Izvođenje nije pronađeno.'], 404);
        }

        return response()->json($izvodjenje);
    }


    #[OA\Put(
        path: "/api/izvodjenja/{id}",
        summary: "Ažuriranje podataka o izvođenju",
        tags: ["Izvođenja"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Uspešno ažurirano")]
    public function update(Request $request, $id)
    {
        $izvodjenje = Izvodjenje::find($id);

        if (!$izvodjenje) {
            return response()->json(['message' => 'Izvođenje nije pronađeno.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'predstava_id'     => 'sometimes|exists:predstave,id',
            'sala_id'          => 'sometimes|exists:sale,id',
            'datum_izvodjenja' => 'sometimes|date',
            'vreme_pocetka'    => 'sometimes',
            'osnovna_cena'     => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $izvodjenje->update($request->all());

        return response()->json([
            'message' => 'Izvođenje uspešno ažurirano.',
            'data'    => $izvodjenje
        ], 200);
    }

    /**
     * Briše izvođenje. Zbog 'cascadeOnDelete' u migraciji, 
     * automatski će se obrisati i sve karte vezane za ovo izvođenje.
     */

    #[OA\Delete(
        path: "/api/izvodjenja/{id}",
        summary: "Brisanje izvođenja i svih njegovih karata",
        tags: ["Izvođenja"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Obrisano")]
    public function destroy($id)
    {
        $izvodjenje = Izvodjenje::find($id);

        if (!$izvodjenje) {
            return response()->json(['message' => 'Izvođenje nije pronađeno.'], 404);
        }

        $izvodjenje->delete();

        return response()->json(['message' => 'Izvođenje i pripadajuće karte su obrisani.'], 200);
    }

    /**
     * Vraća sva izvođenja za određenu predstavu (filtriranje).
     */

    #[OA\Get(
        path: "/api/predstave/{predstavaId}/izvodjenja",
        summary: "Sva izvođenja određene predstave",
        tags: ["Izvođenja"]
    )]
    #[OA\Parameter(name: "predstavaId", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function izvodjenjaZaPredstavu($predstavaId)
    {
        $izvodjenja = Izvodjenje::where('predstava_id', $predstavaId)
            ->with('sala')
            ->get();

        return response()->json($izvodjenja);
    }

    /**
     * Vraća sva izvođenja u određenoj sali.
     */

    #[OA\Get(
        path: "/api/sale/{salaId}/izvodjenja",
        summary: "Prikaz svih izvođenja u određenoj sali",
        tags: ["Izvođenja"]
    )]
    #[OA\Parameter(
        name: "salaId",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function izvodjenjaZaSalu($salaId)
    {
        $izvodjenja = Izvodjenje::where('sala_id', $salaId)
            ->with('predstava')
            ->get();

        return response()->json($izvodjenja);
    }
}


