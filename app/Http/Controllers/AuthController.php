<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
}
