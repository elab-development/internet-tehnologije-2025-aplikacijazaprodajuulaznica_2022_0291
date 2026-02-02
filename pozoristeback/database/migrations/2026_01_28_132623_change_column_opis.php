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
        Schema::table('predstave', function (Blueprint $table) {
            $table->string('opis')->nullable()->change(); //change() ne pravi novu kolonu, da smo izostavili bi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('predstave', function (Blueprint $table) {
            $table->string('opis')->nullable(false)->change();
        });
    }
};
