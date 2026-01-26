<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sale = Sala::all();
        return response()->json($sale);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'naziv' => 'required|string|max:255',
            'kapacitet' => 'required|numeric|min:1'
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422); //422 - ne moze da se obradi
        }

        $data = $validator->validated();
        $sala = Sala::create($data);
        return response()->json($sala, 201); //201 -> created
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sala = Sala::find($id);

        if (!$sala) {
            return response()->json(['message' => 'Sala nije pronađena.'], 404);
        }

        return response()->json($sala);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sala = Sala::find($id);

        if (!$sala) {
            return response()->json(['message' => 'Sala nije pronađena.'], 404);
        }

        $validator = Validator::make($request->all(),[
            'naziv' => 'sometimes|string|max:255',
            'kapacitet' => 'sometimes|numeric|min:1'
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422); //422 - ne moze da se obradi
        }

        $data = $validator->validated();
        $sala->update($data);
        return response()->json($sala, 200); //200 -> ok
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sala = Sala::find($id);
        if(!$sala){
            return response()->json(['message'=>'Sala nije pronađena.'],404);
        }
        $sala->delete();
        return response()->json(['message'=>'Sala je obrisana.'],200);
    }
}
