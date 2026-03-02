<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Korisnik;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    /**
     * NE KORISTIMO RefreshDatabase - čuvamo podatke!
     */
    
    public function test_user_can_login_with_correct_credentials()
    {
        // 1. PRVO proveri da li već postoji admin korisnik u bazi
        $user = Korisnik::where('korisnicko_ime', 'test_admin')->first();
        
        // 2. Ako ne postoji, TEK ONDA ga kreiraj
        if (!$user) {
            $user = Korisnik::create([
                'korisnicko_ime' => 'test_admin',
                'email' => 'admin@test.com',
                'lozinka' => Hash::make('test12345'),
                'uloga' => 'admin',
                'email_verified_at' => now(),
            ]);
            dump('Kreirao sam novog admin korisnika');
        } else {
            dump('Koristim postojećeg admin korisnika:', $user->korisnicko_ime);
            
            // Opciono: ažuriraj lozinku da bude sigurna
            $user->lozinka = Hash::make('test12345');
            $user->save();
        }

        // 3. Pokušaj login
        $response = $this->postJson('/api/login', [
            'korisnicko_ime' => 'test_admin',
            'lozinka' => 'test12345',
        ]);

        // 4. Debug ako ne radi
        if ($response->status() !== 200) {
            dump('Login greška - status:', $response->status());
            dump('Odgovor:', $response->json());
            
            // Proveri da li korisnik postoji u bazi
            $userCheck = Korisnik::where('korisnicko_ime', 'test_admin')->first();
            dump('Korisnik u bazi:', $userCheck ? $userCheck->toArray() : 'Ne postoji');
        }

        // 5. Provere
        $response->assertStatus(200);
        $response->assertJsonStructure(['access_token']);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        // 1. Prvo proveri da li korisnik postoji (nemoj ga ponovo kreirati!)
        $user = Korisnik::where('korisnicko_ime', 'test_admin')->first();
        
        if (!$user) {
            // Ako ne postoji, kreiraj ga (ali samo jednom)
            $user = Korisnik::create([
                'korisnicko_ime' => 'test_admin',
                'email' => 'admin2@test.com',
                'lozinka' => Hash::make('test12345'),
                'uloga' => 'admin', // ← VELIKIM SLOVIMA!
                'email_verified_at' => now(),
            ]);
        }

        // 2. Pokušaj login sa pogrešnom šifrom
        $response = $this->postJson('/api/login', [
            'korisnicko_ime' => 'test_admin',
            'lozinka' => 'pogresna-sifra',
        ]);

        // 3. Proveri da li je status 401 (Unauthorized)
        if ($response->status() !== 401) {
            dump('Očekivao 401, dobio:', $response->status());
            dump('Odgovor:', $response->json());
        }

        $response->assertStatus(401);
    }

    /**
     * Dodatni test - proveri da li je uloga ispravno postavljena
     */
    public function test_admin_uloga_je_ispravna()
    {
        $user = Korisnik::where('korisnicko_ime', 'test_admin')->first();
        
        if (!$user) {
            $this->markTestSkipped('Nema admin korisnika u bazi');
        }
        
        $this->assertEquals('admin', $user->uloga);
    }
}