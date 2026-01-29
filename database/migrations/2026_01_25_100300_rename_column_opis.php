<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('predstave', function (Blueprint $table) {
            $table->renameColumn('opis', 'detalji_predstave');
        });
    }

    public function down(): void
    {
        Schema::table('predstave', function (Blueprint $table) {
            $table->renameColumn('detalji_predstave', 'opis');
        });
    }

};

