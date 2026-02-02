<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('korisnici', function (Blueprint $table) {
            $table->renameColumn('username', 'korisnicko_ime');
            $table->renameColumn('password', 'lozinka');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('korisnici', function (Blueprint $table) {
            $table->renameColumn('korisnicko_ime', 'username');
            $table->renameColumn('lozinka', 'password');
        });
    }
};
