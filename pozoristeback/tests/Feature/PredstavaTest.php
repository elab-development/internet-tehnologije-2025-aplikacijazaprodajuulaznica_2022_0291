<?php

namespace Tests\Feature;

use Tests\TestCase;

class PredstavaTest extends TestCase
{
    public function test_get_all_predstave_endpoint(): void
    {
        $response = $this->get('/api/predstave');

        $response->assertStatus(200);

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
        $response = $this->get('/api/predstave/1');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'naziv' => 'Hasanaginica'
        ]);
    }
}