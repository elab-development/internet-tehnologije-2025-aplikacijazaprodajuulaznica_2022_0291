<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\PredstavaController;
use App\Http\Controllers\IzvodjenjeController;
use App\Http\Controllers\KartaController;
use App\Http\Controllers\RezervacijaController;

//Rute za SalaController
Route::get('/sale', [SalaController::class, 'index']);
Route::get('/sale/{id}', [SalaController::class, 'show']);
Route::post('/sale', [SalaController::class, 'store']);
Route::delete('/sale/{id}', [SalaController::class, 'destroy']);
Route::put('/sale/{id}', [SalaController::class, 'update']);

//Rute za PredstavaController
Route::get('/predstave', [PredstavaController::class, 'index']);
Route::get('/predstave/{id}', [PredstavaController::class, 'show']);
Route::post('/predstave', [PredstavaController::class, 'store']);
Route::delete('/predstave/{id}', [PredstavaController::class, 'destroy']);
Route::put('/predstave/{id}', [PredstavaController::class, 'update']);

//Rute za IzvodjenjeController
Route::get('/izvodjenja', [IzvodjenjeController::class, 'index']);
Route::get('/izvodjenja/{id}', [IzvodjenjeController::class, 'show']);
Route::post('/izvodjenja', [IzvodjenjeController::class, 'store']);
Route::put('/izvodjenja/{id}', [IzvodjenjeController::class, 'update']);
Route::delete('/izvodjenja/{id}', [IzvodjenjeController::class, 'destroy']);
Route::get('/predstave/{id}/izvodjenja', [IzvodjenjeController::class, 'izvodjenjaZaPredstavu']);
Route::get('/sale/{id}/izvodjenja', [IzvodjenjeController::class, 'izvodjenjaZaSalu']);

//Rute za KartaController
Route::get('/izvodjenja/{id}/karte', [KartaController::class, 'karteZaIzvodjenje']);
Route::post('/karte', [KartaController::class, 'store']);
Route::get('/karte/{id}', [KartaController::class, 'show']);

//Rute za RezervacijaController
Route::get('/rezervacije', [RezervacijaController::class, 'index']);
Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
Route::post('/rezervacije', [RezervacijaController::class, 'store']);