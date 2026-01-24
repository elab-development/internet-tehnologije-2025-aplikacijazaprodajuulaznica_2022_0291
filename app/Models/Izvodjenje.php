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
        'vreme_pocetka' => 'time'
    ];

    public function karte(){
        return $this->hasMany(Karta::class);
    }

    public function predstava(){
        return $this->belongsTo(Predstava::class);
    }

    public function sala(){
        return $this->belongsTo(Sala::class);
    }


}
