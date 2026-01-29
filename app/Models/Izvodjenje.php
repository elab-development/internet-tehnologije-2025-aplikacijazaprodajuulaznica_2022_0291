<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Izvodjenje extends Model
{

    protected $table = 'izvodjenja';

    protected $fillable = [
        'predstava_id',
        'sala_id',
        'datum_izvodjenja',
        'vreme_pocetka',
        'osnovna_cena'
    ];

    protected $casts = [
        'datum_izvodjenja' => 'date',
        // 'vreme_pocetka' => 'time',
        'osnovna_cena' => 'decimal:2'
    ];

    # Jedan prema vise - jedno Izvođenje može imati više izdatih karata.
    public function karte(){
        return $this->hasMany(Karta::class); 
    }

    # Pripada jednom - jedno konkretno Izvođenje uvek "pripada" tačno jednoj Predstavi.
    public function predstava(){
        return $this->belongsTo(Predstava::class);
    }

    # Svako Izvođenje se odvija u tačno jednoj Sali.
    public function sala(){
        return $this->belongsTo(Sala::class);
    }


}
