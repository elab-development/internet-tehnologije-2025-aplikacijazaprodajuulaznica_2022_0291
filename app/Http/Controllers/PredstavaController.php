<?php

namespace App\Http\Controllers;

use App\Models\Predstava;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PredstavaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $predstave = Predstava::all();
        return response()->json($predstave);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'naziv' => 'required|string|max:255',
            'opis' => 'required|string|max:255',
            'reditelj' => 'required|string|max:255',
            'trajanje_min' => 'required|numeric|min:1',
            'img_url' => 'required|string|max:255'
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Validacija nije prosla.',
                'errors' => $validator->errors(),
            ], 422); //422 - ne moze da se obradi
        }

        $data = $validator->validated();
        $predstava = Predstava::create($data);
        return response()->json($predstava, 201); //201 -> created
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $predstava = Predstava::find($id);

        if (!$predstava) {
            return response()->json(['message' => 'Predstava nije pronađena.'], 404);
        }

        return response()->json($predstava);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $predstava = Predstava::find($id);

        if (!$predstava) {
            return response()->json(['message' => 'Predstava nije pronađena.'], 404);
        }

        $validator = Validator::make($request->all(),[
            'naziv' => 'sometimes|string|max:255',
            'opis' => 'sometimes|string|max:255',
            'reditelj' => 'sometimes|string|max:255',
            'trajanje_min' => 'sometimes|numeric|min:1',
            'img_url' => 'sometimes|string|max:255'
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422); //422 - ne moze da se obradi
        }

        $data = $validator->validated();
        $predstava->update($data);
        return response()->json($predstava, 200); //200 -> ok
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $predstava = Predstava::find($id);
        if(!$predstava){
            return response()->json(['message'=>'Predstava nije pronađena.'],404);
        }
        $predstava->delete();
        return response()->json(['message'=>'Predstava je obrisana.'],200);
    }
}
