<?php

namespace App\Http\Controllers;

use App\Models\Izvodjenje;
use App\Models\Predstava;
use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IzvodjenjeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $izvodjenja = Izvodjenje::with(['predstava', 'sala'])->get();
        return response()->json($izvodjenja);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'predstava_id' => 'required|exists:predstave,id',
            'sala_id' => 'required|exists:sale,id',
            'datum_izvodjenja' => 'required|date',
            'vreme_pocetka' => 'required',
            'osnovna_cena' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $izvodjenje = Izvodjenje::create($data);

        return response()->json($izvodjenje, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $izvodjenje = Izvodjenje::with(['predstava', 'sala'])->find($id);

        if (!$izvodjenje) {
            return response()->json([
                'message' => 'Izvođenje nije pronađeno.'
            ], 404);
        }

        return response()->json($izvodjenje);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $izvodjenje = Izvodjenje::find($id);

        if (!$izvodjenje) {
            return response()->json([
                'message' => 'Izvođenje nije pronađeno.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'predstava_id' => 'sometimes|exists:predstave,id',
            'sala_id' => 'sometimes|exists:sale,id',
            'datum_izvodjenja' => 'sometimes|date',
            'vreme_pocetka' => 'sometimes',
            'osnovna_cena' => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prošla.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $izvodjenje->update($validator->validated());

        return response()->json($izvodjenje, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $izvodjenje = Izvodjenje::find($id);

        if (!$izvodjenje) {
            return response()->json([
                'message' => 'Izvođenje nije pronađeno.'
            ], 404);
        }

        $izvodjenje->delete();

        return response()->json([
            'message' => 'Izvođenje je obrisano.'
        ], 200);
    }

    /**
     * sva izvođenja za jednu predstavu
     */
    public function izvodjenjaZaPredstavu($predstavaId)
    {
        $izvodjenja = Izvodjenje::where('predstava_id', $predstavaId)
            ->with('sala')
            ->get();

        return response()->json($izvodjenja);
    }

    /**
     * sva izvođenja u jednoj sali
     */
    public function izvodjenjaZaSalu($salaId)
    {
        $izvodjenja = Izvodjenje::where('sala_id', $salaId)
            ->with('predstava')
            ->get();

        return response()->json($izvodjenja);
    }
}
