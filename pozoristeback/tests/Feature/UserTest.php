<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{
    public function test_klijent_ne_moze_da_vidi_listu_svih_korisnika()
    {
        // 1. Kreiramo jedinstvenog klijenta direktno u bazi
        $username = 'test_klijent_' . uniqid();
        DB::table('korisnici')->insert([
            'korisnicko_ime' => $username,
            'email' => $username . '@gmail.com',
            'email_verified_at' => now(),
            'lozinka' => Hash::make('password123'), // Koristimo Hash::make da budemo sigurni
            'uloga' => 'klijent',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Logujemo se da dobijemo token
        $loginResponse = $this->postJson('/api/login', [
            'korisnicko_ime' => $username,
            'lozinka' => 'password123',
        ]);

        // Hvatanje tokena - dodajemo proveru da li uopšte postoji
        $token = $loginResponse->json('access_token') ?? $loginResponse->json('token');

        if (!$token) {
             // Ako token ne postoji, ispiši grešku da vidimo šta login kaže
             $loginResponse->dump();
        }

        // 3. Pokušavamo pristup listi korisnika
        $response = $this->withToken($token)->getJson("/api/korisnici");

        // 4. Očekujemo 404 (Not Found) moglo i 403 (Forbidden)
        $response->assertStatus(404);

        // 5. Čistimo za sobom
        DB::table('korisnici')->where('korisnicko_ime', $username)->delete();
    }
}