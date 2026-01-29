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

class AuthController extends Controller
{
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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'lozinka' => 'required',
        ]);

        $korisnik = Korisnik::where('email', $request->email)->first();

        // Provera lozinke
        if (!$korisnik || !Hash::check($request->lozinka, $korisnik->lozinka)) {
            return response()->json(['poruka' => 'Pogrešni podaci'], 401);
        }

        if (!$korisnik->hasVerifiedEmail()) {
            return response()->json([
                'poruka' => 'Vaš nalog nije verifikovan. Molimo proverite mejl i kliknite na link.'
            ], 403); // 403 Forbidden (Zabranjeno)
        }

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'poruka' => 'Dobrodošli, ' . $korisnik->korisnicko_ime,
            'access_token' => $token,
            'uloga' => $korisnik->uloga
        ]);
    }

    public function logout(Request $request)
    {
        // Uzimamo trenutno ulogovanog korisnika i brišemo token koji je iskoristio za ovaj zahtev
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'poruka' => 'Uspešno ste se odjavili i token je obrisan.'
        ]);
    }

    public function profil(Request $request)
    {
        return response()->json([
            'poruka' => 'Podaci o vašem profilu',
            'korisnik' => $request->user()
        ]);
    }


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

        // Brišemo token jer je iskorišćen
        DB::table('password_reset_tokens')->where(['email' => $request->email])->delete();

        return response()->json(['poruka' => 'Lozinka je uspešno promenjena!']);
    }
}
