<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Korisnik;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{

    public function test_klijent_ne_moze_da_vidi_listu_svih_korisnika()
    {
        $user = Korisnik::create([
            'korisnicko_ime' => 'test_klijent_' . uniqid(),
            'email' => 'test_' . uniqid() . '@example.com',
            'lozinka' => Hash::make('password123'),
            'uloga' => 'klijent',
            'email_verified_at' => now(),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'korisnicko_ime' => $user->korisnicko_ime,
            'lozinka' => 'password123',
        ]);

        $loginResponse->assertStatus(200);
        
        $token = $loginResponse->json('access_token');

        $response = $this->withToken($token)->getJson("/api/korisnici");

        $response->assertStatus(404);
    }
}