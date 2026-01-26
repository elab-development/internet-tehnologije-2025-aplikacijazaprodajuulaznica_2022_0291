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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rezervacije = Rezervacija::with('stavke.karta')->get();
        return response()->json($rezervacije);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:korisnici,id',
            'nacin_placanja' => 'required|in:kartica,poklon_vaucer,na_blagajni',
            'karte' => 'required|array|min:1',
            'karte.*' => 'required|exists:karte,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $ukupnaCena = 0;

            $rezervacija = Rezervacija::create([
                'user_id' => $request->user_id,
                'ukupna_cena' => 0, // privremeno
                'nacin_placanja' => $request->nacin_placanja,
                'status' => 'na_cekanju',
                'datum_kreiranja' => now()
            ]);

            foreach ($request->karte as $kartaId) {
                $karta = Karta::find($kartaId);

                if ($karta->prodata) {
                    throw new \Exception('Karta je već prodata.');
                }

                StavkaRezervacije::create([
                    'rezervacija_id' => $rezervacija->id,
                    'karta_id' => $karta->id,
                    'cena_stavke' => $karta->cena,
                    'kolicina' => 1
                ]);

                $karta->update(['prodata' => true]);
                $ukupnaCena += $karta->cena;
            }

            $rezervacija->update([
                'ukupna_cena' => $ukupnaCena,
                'status' => 'potvrdjena'
            ]);

            DB::commit();

            return response()->json($rezervacija->load('stavke.karta'), 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Greška prilikom kreiranja rezervacije.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Rezervacija $id)
    {
        $rezervacija = Rezervacija::with('stavke.karta')->find($id);

        if (!$rezervacija) {
            return response()->json([
                'message' => 'Rezervacija nije pronađena.'
            ], 404);
        }

        return response()->json($rezervacija);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rezervacija $rezervacija)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rezervacija $rezervacija)
    {
        //
    }
}
