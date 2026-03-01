<?php

namespace Tests\Feature;

use Tests\TestCase;

class RezervacijaTest extends TestCase
{
    public function test_ne_moze_se_rezervisati_vec_prodata_karta()
    {
        $loginResponse = $this->postJson('/api/login', [
            'korisnicko_ime' => 'anjap_admin',
            'lozinka' => 'anjap123',
        ]);
        $token = $loginResponse->json('access_token') ?? $loginResponse->json('token');

        // Karta 32 je prodata
        $response = $this->withToken($token)->postJson('/api/rezervacije', [
            'korisnik_id' => 25,
            'karte' => [32],
            'nacin_placanja' => 'kartica',
            'ukupna_cena' => 1000.00,
            'status' => 'kreirana',
            'datum_kreiranja' => now()->format('Y-m-d')
        ]);

        // Tvoj API vraća 400 (Bad Request) za ovu grešku, pa to i proveravamo
        $response->assertStatus(400);

        // PROMENA: Proveravamo tvoju tačnu poruku iz baze
        $response->assertJsonFragment(['greska' => 'Karta sa ID-em 32 je već prodata ili ne postoji.']);
    }
}