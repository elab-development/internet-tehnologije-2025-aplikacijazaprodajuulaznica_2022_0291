<?php

namespace App\Http\Controllers;

use App\Models\Karta;
use App\Models\Izvodjenje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KartaController extends Controller
{
    // Vraća sve karte u sistemu (korisno za admina).

    public function index()
    {
        // Uzimamo karte i odmah učitavamo podatke o izvođenju, predstavi i sali
        $karte = Karta::with(['izvodjenje.predstava', 'izvodjenje.sala'])->get();
        return response()->json($karte);
    }

    /**
     * Store metoda - samo za vanredno dodavanje pojedinačne karte.
     */
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
