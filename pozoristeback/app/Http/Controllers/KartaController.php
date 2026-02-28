<?php

namespace App\Http\Controllers;

use App\Models\Karta;
use App\Models\Izvodjenje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use OpenApi\Attributes as OA;

class KartaController extends Controller
{
    // Vraća sve karte u sistemu (korisno za admina).


    #[OA\Get(
        path: "/api/karte",
        summary: "Prikaz svih karata u sistemu",
        tags: ["Karte"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Uspešno učitane karte")]
    public function index()
    {
        // Uzimamo karte i odmah učitavamo podatke o izvođenju, predstavi i sali
        $karte = Karta::with(['izvodjenje.predstava', 'izvodjenje.sala'])->get();
        return response()->json($karte);
    }

    /**
     * Store metoda - samo za vanredno dodavanje pojedinačne karte.
     */

    #[OA\Post(
        path: "/api/karte",
        summary: "Dodavanje pojedinačne karte",
        tags: ["Karte"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["izvodjenje_id", "broj_sedista", "cena"],
            properties: [
                new OA\Property(property: "izvodjenje_id", type: "integer", example: 1),
                new OA\Property(property: "broj_sedista", type: "integer", example: 12),
                new OA\Property(property: "cena", type: "number", format: "float", example: 800.50),
                new OA\Property(property: "prodata", type: "boolean", example: false)
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Karta kreirana")]
    #[OA\Response(response: 422, description: "Greška u validaciji")]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'izvodjenje_id' => 'required|exists:izvodjenja,id',
            'broj_sedista'  => 'required|integer|min:1', 
            'cena'          => 'required|numeric|min:0',
            'prodata'       => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['prodata'] = $data['prodata'] ?? false;

        $karta = Karta::create($data);

        return response()->json($karta, 201);
    }

    /**
     * Detalji jedne karte.
     */

    #[OA\Get(
        path: "/api/karte/{id}",
        summary: "Detalji pojedinačne karte",
        tags: ["Karte"]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    #[OA\Response(response: 404, description: "Karta nije pronađena")]
    public function show($id)
    {
        $karta = Karta::with(['izvodjenje.predstava', 'izvodjenje.sala'])->find($id);

        if (!$karta) {
            return response()->json(['message' => 'Karta nije pronađena.'], 404);
        }

        return response()->json($karta);
    }

    /**
     * Karte za određeno izvođenje - BITNA METODA.
     * Kada korisnik klikne na predstavu da vidi slobodna mesta.
     */

    #[OA\Get(
        path: "/api/karte/izvodjenje/{izvodjenjeId}",
        summary: "Prikaz svih karata za određeno izvođenje",
        description: "Vraća i slobodne i prodate karte radi prikaza sale u React-u.",
        tags: ["Karte"]
    )]
    #[OA\Parameter(
        name: "izvodjenjeId",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(response: 200, description: "Uspešno")]
    #[OA\Response(response: 404, description: "Izvođenje nije pronađeno")]
    public function karteZaIzvodjenje($izvodjenjeId)
    {
        $izvodjenje = Izvodjenje::find($izvodjenjeId);

        if (!$izvodjenje) {
            return response()->json(['message' => 'Izvođenje nije pronađeno.'], 404);
        }

        // Vraćamo sve karte za to izvođenje (i prodate i slobodne da bi mogla da se nacrta sala)
        $karte = Karta::where('izvodjenje_id', $izvodjenjeId)
                      ->orderBy('broj_sedista', 'asc')
                      ->get();

        return response()->json($karte);
    }

    /**
     * Brisanje karte
     */

    #[OA\Delete(
        path: "/api/karte/{id}",
        summary: "Brisanje karte",
        tags: ["Karte"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Obrisano")]
    #[OA\Response(response: 404, description: "Karta nije pronađena")]
    public function destroy($id)
    {
        $karta = Karta::find($id);
        if (!$karta) {
            return response()->json(['message' => 'Karta nije pronađena.'], 404);
        }
        $karta->delete();
        return response()->json(['message' => 'Karta je uklonjena iz sistema.'], 200);
    }

}
