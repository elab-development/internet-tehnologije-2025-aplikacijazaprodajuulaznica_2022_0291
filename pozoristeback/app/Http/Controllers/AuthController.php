<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Mail\ResetPasswordMail;

use OpenApi\Attributes as OA;

class AuthController extends Controller
{

    #[OA\Post(
        path: "/api/registracija",
        summary: "Registracija novog korisnika",
        tags: ["Autentifikacija"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["korisnicko_ime", "email", "lozinka"],
            properties: [
                new OA\Property(property: "korisnicko_ime", type: "string", example: "marija_m"),
                new OA\Property(property: "email", type: "string", example: "marija@example.com"),
                new OA\Property(property: "lozinka", type: "string", example: "lozinka123")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Uspešna registracija")]
    #[OA\Response(response: 400, description: "Greška u validaciji")]
    public function registracija(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'korisnicko_ime' => 'required|string|max:255|unique:korisnici',
            'email' => 'required|string|email|max:255|unique:korisnici',
            'lozinka' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $korisnik = Korisnik::create([
            'korisnicko_ime' => $request->korisnicko_ime,
            'email' => $request->email,
            'lozinka' => Hash::make($request->lozinka),
            'uloga' => 'klijent', 
        ]);

        try {
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $korisnik->id, 'hash' => sha1($korisnik->email)]
            );

            Mail::to($korisnik->email)->send(new VerifyEmail($korisnik, $verificationUrl));

        } catch (\Exception $e) {
            return response()->json([
                'poruka' => 'Korisnik kreiran, ali slanje custom mejla nije uspelo!',
                'error_detalji' => $e->getMessage()
            ], 500);
        }

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'poruka' => 'Uspešna registracija!',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }


    #[OA\Post(
        path: "/api/login",
        summary: "Logovanje korisnika",
        tags: ["Autentifikacija"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["korisnicko_ime", "lozinka"],
            properties: [
                new OA\Property(property: "korisnicko_ime", type: "string", example: "marija_m"),
                new OA\Property(property: "lozinka", type: "string", example: "lozinka123")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Uspešan login")]
    #[OA\Response(response: 401, description: "Pogrešni podaci")]
    #[OA\Response(response: 403, description: "Nalog nije verifikovan")]
    public function login(Request $request)
    {
        // return response()->json(['poruka' => 'Stigao si do backenda!'], 200);
        
        $request->validate([
            'korisnicko_ime' => 'required', //
            'lozinka' => 'required',
        ]);

        
        $korisnik = Korisnik::where('korisnicko_ime', $request->korisnicko_ime)->first(); //

        
        if (!$korisnik || !Hash::check($request->lozinka, $korisnik->lozinka)) {
            return response()->json(['poruka' => 'Pogrešni podaci'], 401); //
        }


        
        if (!$korisnik->hasVerifiedEmail()) {
            return response()->json([
                'poruka' => 'Vaš nalog nije verifikovan.'
            ], 403); //
        }
        

        $token = $korisnik->createToken('auth_token')->plainTextToken; //

        return response()->json([
            'poruka' => 'Dobrodošli, ' . $korisnik->korisnicko_ime,
            'access_token' => $token,
            'uloga' => $korisnik->uloga, //komentar
            'korisnik' => $korisnik // Dodajemo celog korisnika da React ima ID i ime
        ]);
    }


    #[OA\Post(
        path: "/api/logout",
        summary: "Odjava korisnika",
        security: [["sanctum" => []]],
        tags: ["Autentifikacija"]
    )]
    #[OA\Response(response: 200, description: "Uspešan logout")]
    public function logout(Request $request)
    {
        // Uzimamo trenutno ulogovanog korisnika i brišemo token koji je iskoristio za ovaj zahtev
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'poruka' => 'Uspešno ste se odjavili i token je obrisan.'
        ]);
    }


    #[OA\Get(
        path: "/api/profil",
        summary: "Podaci o ulogovanom korisniku",
        security: [["sanctum" => []]],
        tags: ["Autentifikacija"]
    )]
    #[OA\Response(response: 200, description: "Uspešno")]
    public function profil(Request $request)
    {
        return response()->json([
            'poruka' => 'Podaci o vašem profilu',
            'korisnik' => $request->user()
        ]);
    }


    
    #[OA\Get(
        path: "/api/verify/{id}/{hash}",
        summary: "Verifikacija email adrese",
        tags: ["Autentifikacija"]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        description: "ID korisnika",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "hash",
        in: "path",
        description: "SHA-1 hash email adrese",
        required: true,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(response: 200, description: "Email uspešno verifikovan")]
    #[OA\Response(response: 401, description: "Nevalidan ili istekao potpis")]
    public function verify(Request $request) {
        //Da li je URL validan
        if (!$request->hasValidSignature()) {
            return response()->json(["poruka" => "Link je nevalidan ili je istekao."], 401);
        }

        $korisnik = Korisnik::findOrFail($request->id);

        // Ako već nije verifikovan, označi ga kao verifikovanog
        if (!$korisnik->hasVerifiedEmail()) {
            $korisnik->markEmailAsVerified();
        }

        // Kasnije prebcujemo ovo na React login stranicu, za sad  samo JSON
        return response()->json(["poruka" => "Email je uspešno verifikovan!"]);
    }


    #[OA\Post(
        path: "/api/zaboravljena-lozinka",
        summary: "Slanje mejla za reset lozinke",
        tags: ["Autentifikacija"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [new OA\Property(property: "email", type: "string", example: "marija@example.com")]
        )
    )]
    #[OA\Response(response: 200, description: "Mejl poslat")]
    public function zaboravljenaLozinka(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $korisnik = Korisnik::where('email', $request->email)->first();

        if (!$korisnik) {
            return response()->json(['poruka' => 'Korisnik sa tim mejlom ne postoji.'], 404);
        }

        // Generišemo nasumičan token
        $token = Str::random(64);

        // Čuvamo token u tabeli password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );

        // Link koji ćemo poslati (ovo ce voditi na frontend)
        $url = "http://localhost:3000/reset-password?token=" . $token . "&email=" . $request->email;

        // Šaljemo mejl
        Mail::to($korisnik->email)->send(new \App\Mail\ResetPasswordMail($url));

        return response()->json(['poruka' => 'Mejl za resetovanje lozinke je poslat!']);
    }



    #[OA\Post(
        path: "/api/resetuj-lozinku",
        summary: "Resetovanje lozinke",
        tags: ["Autentifikacija"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["token", "email", "lozinka"],
            properties: [
                new OA\Property(property: "token", type: "string"),
                new OA\Property(property: "email", type: "string"),
                new OA\Property(property: "lozinka", type: "string"),
                new OA\Property(property: "lozinka_confirmation", type: "string")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Lozinka promenjena")]
    public function resetujLozinku(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'lozinka' => 'required|string|min:8|confirmed',
        ]);

        $provera = DB::table('password_reset_tokens')
            ->where(['email' => $request->email, 'token' => $request->token])
            ->first();

        if (!$provera) {
            return response()->json(['poruka' => 'Nevalidan token ili email!'], 400);
        }

        $korisnik = Korisnik::where('email', $request->email)->first();
        $korisnik->update(['lozinka' => Hash::make($request->lozinka)]);

        DB::table('password_reset_tokens')->where(['email' => $request->email])->delete();

        return response()->json(['poruka' => 'Lozinka je uspešno promenjena!']);
    }
}



