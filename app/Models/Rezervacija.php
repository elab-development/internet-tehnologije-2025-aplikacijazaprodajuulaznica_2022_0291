<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    protected $fillable = [
        'korisnik_id',
        'ukupna_cena',
        'nacin_placanja',
        'status',
        'datum_kreiranja'
    ];

    protected $casts = [
        'datum_kreiranja' => 'date'
    ];

    public function korisnik(){
        return $this->belongsTo(User::class);
    }

    public function stavke(){
        return $this->hasMany(StavkaRezervacije::class);
    }
}
