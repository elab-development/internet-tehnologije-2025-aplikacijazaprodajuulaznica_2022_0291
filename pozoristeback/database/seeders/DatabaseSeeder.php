<?php

namespace Database\Seeders;

use App\Models\Korisnik;
use App\Models\Predstava;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('sale')->insert([
            [
                'id' => 1,
                'naziv' => 'Velika sala',
                'kapacitet' => 200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'naziv' => 'Mala sala',
                'kapacitet' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 1. KORISNICI - sa verifikacijom
        Korisnik::create([
            'korisnicko_ime' => 'test_admin',
            'email' => 'admin@test.com',
            'lozinka' => Hash::make('test12345'),
            'uloga' => 'admin',  // Proveri da li je ovo dozvoljena vrednost
            'email_verified_at' => now(),
        ]);

        // 2. PREDSTAVE
        Predstava::create([
            'naziv' => 'Hasanaginica',
            'opis' => 'Tragedija zasnovana na narodnoj baladi',
            'reditelj' => 'Jagoš Marković',
            'trajanje_min' => 120,
            'img_url' => '/slike/hasanaginica.jpg'
        ]);

        // 3. IZVODJENJA
        DB::table('izvodjenja')->insert([
            'sala_id' => 1,
            'predstava_id' => 1,
            'datum_izvodjenja' => '2026-03-10',
            'vreme_pocetka' => '19:00:00',
            'osnovna_cena' => 1000.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. KARTE
        DB::table('karte')->insert([
            'izvodjenje_id' => 1,
            'broj_sedista' => 'A100',
            'cena' => 1000.00,
            'prodata' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}