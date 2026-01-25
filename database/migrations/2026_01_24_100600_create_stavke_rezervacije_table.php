<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stavke_rezervacije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rezervacija_id')
                ->constrained('rezervacije')
                ->cascadeOnDelete();

            $table->foreignId('karta_id')
                ->constrained('karte')
                ->cascadeOnDelete();

            $table->decimal('cena_stavke', 8, 2);
            $table->integer('kolicina')->default(1);

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stavke_rezervacije');
    }
};
