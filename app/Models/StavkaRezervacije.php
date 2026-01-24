<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StavkaRezervacije extends Model
{
    protected $fillable = [
        'rezervacija_id',
        'karta_id',
        'cena_stavke',
        'kolicina'
    ];

    public function rezervacija(){
        return $this->belongsTo(Rezervacija::class);
    }

    public function karta(){
        return $this->belongsTo(Karta::class);
    }

}
