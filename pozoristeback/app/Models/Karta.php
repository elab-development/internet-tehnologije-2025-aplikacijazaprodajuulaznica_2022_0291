<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Karta extends Model
{

use HasFactory;

    protected $table = 'karte';

    protected $fillable = [
        'izvodjenje_id',
        'broj_sedista',
        'cena',
        'prodata'
    ];

    protected $casts = [
        'prodata' => 'boolean',
        'cena' => 'decimal:2',
    ];

    // Relacija ka stavkama rezervacije
    public function stavke(){
        return $this->hasMany(StavkaRezervacije::class);
    }

    // Relacija ka izvođenju (Karta pripada jednom izvođenju)
    public function izvodjenje(){
        return $this->belongsTo(Izvodjenje::class);
    }

}


