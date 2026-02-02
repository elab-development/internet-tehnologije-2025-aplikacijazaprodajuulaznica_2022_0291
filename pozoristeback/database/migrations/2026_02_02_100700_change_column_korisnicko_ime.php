<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('korisnici', function (Blueprint $table) {
            // Dodajemo unique indeks na već postojeću kolonu
            $table->string('korisnicko_ime')->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('korisnici', function (Blueprint $table) {
            // U slučaju da se predomisliš unazad, skidaš unique
            $table->dropUnique(['korisnicko_ime']);
        });
    }
};
