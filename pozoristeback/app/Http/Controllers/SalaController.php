<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use OpenApi\Attributes as OA;

class SalaController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    #[OA\Get(
        path: "/api/sale",
        summary: "Prikaz svih sala",
        tags: ["Sale"]
    )]
    #[OA\Response(response: 200, description: "Uspešno učitane sale")]
    public function index()
    {
        $sale = Sala::all();
        return response()->json($sale);
    }

    /**
     * Store a newly created resource in storage.
     */

    #[OA\Post(
        path: "/api/sale",
        summary: "Dodavanje nove sale",
        tags: ["Sale"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["naziv", "kapacitet"],
            properties: [
                new OA\Property(property: "naziv", type: "string", example: "Velika scena"),
                new OA\Property(property: "kapacitet", type: "integer", example: 350)
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Uspešno kreirano")]
    #[OA\Response(response: 422, description: "Greška u validaciji")]
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

    #[OA\Get(
        path: "/api/sale/{id}",
        summary: "Prikaz jedne sale",
        tags: ["Sale"]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    #[OA\Response(response: 404, description: "Sala nije pronađena")]
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

    #[OA\Put(
        path: "/api/sale/{id}",
        summary: "Ažuriranje sale",
        tags: ["Sale"]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "naziv", type: "string", example: "Mala scena - renovirana"),
                new OA\Property(property: "kapacitet", type: "integer", example: 120)
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Uspešno ažurirano")]
    #[OA\Response(response: 404, description: "Sala nije pronađena")]
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

    #[OA\Delete(
        path: "/api/sale/{id}",
        summary: "Brisanje sale",
        tags: ["Sale"]
    )]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Obrisano")]
    #[OA\Response(response: 404, description: "Sala nije pronađena")]
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
