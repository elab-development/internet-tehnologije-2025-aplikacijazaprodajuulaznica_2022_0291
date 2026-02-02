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
        Schema::create('izvodjenja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sala_id')
                ->constrained('sale')
                ->cascadeOnDelete();
            $table->foreignId('predstava_id')
                ->constrained('predstave')
                ->cascadeOnDelete();
            $table->date('datum_izvodjenja');
            $table->time('vreme_pocetka');
            $table->decimal('osnovna_cena',8,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('izvodjenja');
    }
};


