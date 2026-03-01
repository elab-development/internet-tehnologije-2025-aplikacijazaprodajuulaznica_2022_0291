<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthTest extends TestCase
{
    /**
     * Test: Da li Anja može da se uloguje sa ispravnim podacima.
     */
    public function test_user_can_login_with_correct_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'korisnicko_ime' => 'anjap_admin', 
            'lozinka' => 'anjap123',           
        ]);

        // Sad bi trebalo da dobiješ 200
        $response->assertStatus(200);
    }

    /**
     * Test: Odbijanje logina sa lošom lozinkom.
     */
    public function test_user_cannot_login_with_wrong_password(): void
    {
        $response = $this->postJson('/api/login', [
            'korisnicko_ime' => 'anjap_admin',
            'lozinka' => 'pogresna-sifra-123',
        ]);

        // Očekujemo 401 (Unauthorized) nakon što prođe validaciju polja
        $response->assertStatus(401);
    }
}