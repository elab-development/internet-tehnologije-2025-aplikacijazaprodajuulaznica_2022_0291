<?php

namespace App\Http\Controllers;

use App\Models\Karta;
use App\Models\Izvodjenje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KartaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    //Samo admin moze ovo da radi
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'izvodjenje_id' => 'required|exists:izvodjenja,id',
            'sedista' => 'required|string|max:50',
            'cena' => 'required|numeric|min:0',
            'prodata' => 'boolean'
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
     * Display the specified resource.
     */
    public function show($id)
    {
        $karta = Karta::with('izvodjenje')->find($id);

        if (!$karta) {
            return response()->json([
                'message' => 'Karta nije pronađena.'
            ], 404);
        }

        return response()->json($karta);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Karta $karta)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Karta $karta)
    {
        //
    }

    public function karteZaIzvodjenje($izvodjenjeId)
    {
        $izvodjenje = Izvodjenje::find($izvodjenjeId);

        if (!$izvodjenje) {
            return response()->json([
                'message' => 'Izvođenje nije pronađeno.'
            ], 404);
        }

        $karte = Karta::where('izvodjenje_id', $izvodjenjeId)->get();

        return response()->json($karte);
    }
}
