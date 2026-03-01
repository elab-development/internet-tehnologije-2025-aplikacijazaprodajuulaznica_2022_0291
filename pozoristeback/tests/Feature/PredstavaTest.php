<?php

namespace Tests\Feature;

use Tests\TestCase;

class PredstavaTest extends TestCase
{
    /**
     * Testira da li API ispravno vraća listu svih predstava.
     */
    public function test_get_all_predstave_endpoint(): void
    {
        // Šaljemo GET zahtjev na tvoj API endpoint
        $response = $this->get('/api/predstave');

        // Provjeravamo da li je status odgovora 200 (OK)
        $response->assertStatus(200);

        // Provjeravamo da li JSON struktura odgovora odgovara tvojoj bazi
        $response->assertJsonStructure([
            '*' => [
                'id',
                'naziv',
                'opis',
                'reditelj',
                'trajanje_min',
                'img_url'
            ]
        ]);
    }

    /**
     * Testira da li API vraća detalje za jednu specifičnu predstavu (npr. Hasanaginica).
     */
    public function test_get_single_predstava_details(): void
    {
        // Pretpostavljamo da predstava s ID 1 postoji (Hasanaginica)
        $response = $this->get('/api/predstave/1');

        $response->assertStatus(200);
        
        // Provjeravamo da li se u odgovoru pojavljuje ispravan naziv
        $response->assertJsonFragment([
            'naziv' => 'Hasanaginica'
        ]);
    }
}