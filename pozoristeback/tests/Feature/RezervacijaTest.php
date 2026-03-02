<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Korisnik;
use App\Models\Predstava;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RezervacijaTest extends TestCase
{

    public function test_ne_moze_se_rezervisati_vec_prodata_karta()
    {
        // ===== KREIRANJE KORISNIKA - SA ISPRAVNOM ULOGOM =====
        $user = Korisnik::create([
            'korisnicko_ime' => 'test_korisnik_' . uniqid(),
            'email' => 'test_' . uniqid() . '@example.com',
            'lozinka' => Hash::make('test12345'),
            'uloga' => 'klijent',
            'email_verified_at' => now(),
        ]);

        // Kreiranje predstave
        $predstava = Predstava::create([
            'naziv' => 'Test predstava',
            'opis' => 'Test opis',
            'reditelj' => 'Test reditelj',
            'trajanje_min' => 120,
            'img_url' => '/test.jpg'
        ]);

        // Kreiranje izvodjenja
        $izvodjenjeId = DB::table('izvodjenja')->insertGetId([
            'sala_id' => 1,
            'predstava_id' => $predstava->id,
            'datum_izvodjenja' => now()->addDays(5)->format('Y-m-d'),
            'vreme_pocetka' => '20:00:00',
            'osnovna_cena' => 1000.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Kreiranje prodate karte
        $kartaId = DB::table('karte')->insertGetId([
            'izvodjenje_id' => $izvodjenjeId,
            'broj_sedista' => 'A100',
            'cena' => 1000.00,
            'prodata' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Login
        $loginResponse = $this->postJson('/api/login', [
            'korisnicko_ime' => $user->korisnicko_ime,
            'lozinka' => 'test12345',
        ]);

        $loginResponse->assertStatus(200);
        $token = $loginResponse->json('access_token');

        // Pokušaj rezervacije
        $response = $this->withToken($token)->postJson('/api/rezervacije', [
            'korisnik_id' => $user->id,
            'karte' => [$kartaId],
            'nacin_placanja' => 'kartica',
            'ukupna_cena' => 1000.00
        ]);

        $response->assertStatus(400);
        $response->assertJsonFragment([
            'greska' => "Karta sa ID-em $kartaId je već prodata ili ne postoji."
        ]);
    }
}