<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\PredstavaController;
use App\Http\Controllers\IzvodjenjeController;
use App\Http\Controllers\KartaController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\AuthController;

// 1. JAVNE RUTE (Dostupne svima, bez logovanja)
Route::post('/registracija', [AuthController::class, 'registracija']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
    ->name('verification.verify');

        // 1. Ruta za slanje mejla
Route::post('/zaboravljena-lozinka', [AuthController::class, 'zaboravljenaLozinka']);

        // 2. Ruta koja menja lozinku kada korisnik klikne na link
Route::post('/reset-lozinke', [AuthController::class, 'resetujLozinku']);

// Pretraga i Relacije
Route::get('/predstave/pretraga', [PredstavaController::class, 'pretraga']);
Route::get('/predstave/{id}/izvodjenja', [IzvodjenjeController::class, 'izvodjenjaZaPredstavu']);
Route::get('/sale/{id}/izvodjenja', [IzvodjenjeController::class, 'izvodjenjaZaSalu']);
Route::get('/izvodjenja/{id}/karte', [KartaController::class, 'karteZaIzvodjenje']); // OVO JE FALILO

// Pregled osnovnih podataka
Route::get('/predstave', [PredstavaController::class, 'index']);
Route::get('/predstave/{id}', [PredstavaController::class, 'show']);
Route::get('/izvodjenja', [IzvodjenjeController::class, 'index']);
Route::get('/izvodjenja/{id}', [IzvodjenjeController::class, 'show']);

//  2. ZAŠTIĆENE RUTE (Samo za ulogovane)
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/profil', [AuthController::class, 'profil']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rad sa rezervacijama i kupovina karata
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::post('/karte', [KartaController::class, 'store']);
    Route::get('/karte/{id}', [KartaController::class, 'show']);


    // 3. ADMIN ZONA (Samo uloga 'admin')

    Route::middleware('admin')->group(function () {

        Route::put('/rezervacije/{id}/potvrdi', [RezervacijaController::class, 'potvrdiRezervaciju']);
        
        // Upravljanje salama (CRUD)
        Route::get('/sale', [SalaController::class, 'index']);
        Route::get('/sale/{id}', [SalaController::class, 'show']);
        Route::post('/sale', [SalaController::class, 'store']);
        Route::put('/sale/{id}', [SalaController::class, 'update']);
        Route::delete('/sale/{id}', [SalaController::class, 'destroy']);

        // Upravljanje predstavama
        Route::post('/predstave', [PredstavaController::class, 'store']);
        Route::put('/predstave/{id}', [PredstavaController::class, 'update']);
        Route::delete('/predstave/{id}', [PredstavaController::class, 'destroy']);

        // Upravljanje izvođenjima
        Route::post('/izvodjenja', [IzvodjenjeController::class, 'store']);
        Route::put('/izvodjenja/{id}', [IzvodjenjeController::class, 'update']);
        Route::delete('/izvodjenja/{id}', [IzvodjenjeController::class, 'destroy']);

        // Admin uvid u sve transakcije
        Route::get('/rezervacije', [RezervacijaController::class, 'index']);
        Route::get('/karte', [KartaController::class, 'index']);
    });
});
