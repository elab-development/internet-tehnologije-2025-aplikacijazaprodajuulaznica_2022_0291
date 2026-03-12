<?php

namespace App\Http\Controllers;

use App\Models\Predstava;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Teatar Maska API",
    version: "1.0.0",
    description: "API dokumentacija za seminarski rad"
)]
#[OA\Server(url: "http://localhost:8000", description: "Lokalni server")]
class PredstavaController extends Controller
{


    #[OA\Get(
        path: "/api/predstave",
        summary: "Prikaz svih predstava",
        tags: ["Predstave"]
    )]
    #[OA\Response(
        response: 200,
        description: "Uspešno učitane predstave"
    )]

    public function index()
    {
        $predstave = Predstava::all();
        return response()->json($predstave);
    }

    /**
     * Store a newly created resource in storage.
     */

    #[OA\Post(
        path: "/api/predstave",
        summary: "Dodavanje nove predstave",
        tags: ["Predstave"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["naziv", "opis", "reditelj", "trajanje_min", "img_url"],
            properties: [
                new OA\Property(property: "naziv", type: "string", example: "Gospođa ministarka"),
                new OA\Property(property: "opis", type: "string", example: "Komedija Branislava Nušića"),
                new OA\Property(property: "reditelj", type: "string", example: "Jagoš Marković"),
                new OA\Property(property: "trajanje_min", type: "integer", example: 105),
                new OA\Property(property: "img_url", type: "string", example: "https://link-ka-slici.com/slika.jpg")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Uspešno kreirano")]
    #[OA\Response(response: 422, description: "Greška u validaciji")]
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

    #[OA\Get(path: "/api/predstave/{id}", summary: "Prikaz jedne predstave", tags: ["Predstave"])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Uspešno")]
    #[OA\Response(response: 404, description: "Nije pronađena")]
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


    #[OA\Put(
        path: "/api/predstave/{id}",
        summary: "Ažuriranje postojeće predstave",
        tags: ["Predstave"]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        description: "ID predstave koju ažurirate",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "naziv", type: "string", example: "Nova verzija naziva"),
                new OA\Property(property: "opis", type: "string", example: "Novi opis predstave..."),
                new OA\Property(property: "reditelj", type: "string", example: "Ime novog reditelja"),
                new OA\Property(property: "trajanje_min", type: "integer", example: 110),
                new OA\Property(property: "img_url", type: "string", example: "https://novi-link.jpg")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Predstava uspešno ažurirana")]
    #[OA\Response(response: 404, description: "Predstava nije pronađena")]
    #[OA\Response(response: 422, description: "Greška u validaciji podataka")]
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

    #[OA\Delete(path: "/api/predstave/{id}", summary: "Brisanje predstave", tags: ["Predstave"])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Obrisano")]
    public function destroy($id)
    {
        $predstava = Predstava::find($id);
        if(!$predstava){
            return response()->json(['message'=>'Predstava nije pronađena.'],404);
        }
        $predstava->delete();
        return response()->json(['message'=>'Predstava je obrisana.'],200);
    }

    #[OA\Get(
        path: "/api/predstave/pretraga",
        summary: "Pretraga predstava po nazivu",
        tags: ["Predstave"]
    )]
    #[OA\Parameter(
        name: "naziv",
        in: "query",
        description: "Deo naziva predstave za pretragu",
        required: true,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(response: 200, description: "Uspešna pretraga")]
    #[OA\Response(response: 400, description: "Loš zahtev (fali parametar)")]
    public function pretraga(Request $request)
    {
        $naziv = $request->query('naziv');

        if (!$naziv) {
            return response()->json(['poruka' => 'Niste uneli parametar za pretragu'], 400);
        }

        // Koristimo % pre i posle da pronađe bilo koji deo reči
        $predstave = \App\Models\Predstava::where('naziv', 'LIKE', '%' . $naziv . '%')->get();

        return response()->json($predstave);
    }


    #[OA\Get(
        path: "/api/predstave/{id}/izvodjenja",
        summary: "Prikaz svih izvođenja za određenu predstavu",
        tags: ["Predstave"]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        description: "ID predstave",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(response: 200, description: "Uspešno učitana izvođenja")]
    #[OA\Response(response: 404, description: "Predstava nije pronađena")]
    public function izvodjenja($id)
    {
        $predstava = \App\Models\Predstava::find($id);
        if (!$predstava) {
            return response()->json(['poruka' => 'Predstava nije pronađena'], 404);
        }
        
        // Vraća sva izvođenja koja pripadaju toj predstavi
        return response()->json($predstava->izvodjenja);
    }

        #[OA\Get(
        path: "/api/stats/popularne-predstave",
        summary: "Statistika top 5 najprodavanijih predstava",
        tags: ["Statistika"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(response: 200, description: "Uspešno učitana statistika")]
    #[OA\Response(response: 403, description: "Zabranjen pristup (samo admin)")]

    public function statistikaPopularnosti()
    {
        // Uzimamo predstave i brojimo prodate karte kroz relacije
        $stats = Predstava::select('predstave.naziv', DB::raw('count(karte.id) as broj_prodatih_karata'))
            ->join('izvodjenja', 'predstave.id', '=', 'izvodjenja.predstava_id')
            ->join('karte', 'izvodjenja.id', '=', 'karte.izvodjenje_id')
            ->where('karte.prodata', true) // brojimo samo one koje su prodate
            ->groupBy('predstave.id', 'predstave.naziv')
            ->orderBy('broj_prodatih_karata', 'desc')
            ->take(5) // Top 5 najpopularnijih
            ->get();

        return response()->json($stats);
    }
}



