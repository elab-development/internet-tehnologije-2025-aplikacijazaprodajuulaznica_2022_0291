<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karta extends Model
{
    protected $fillable = [
        'izvodjenje_id',
        'sedista',
        'cena',
        'prodata'
    ];

    protected $casts = [
        'prodata' => 'boolean',
    ];

    public function stavke(){
        return $this->hasMany(StavkaRezervacije::class);
    }

    public function izvodjenje(){
        return $this->belongsTo(Izvodjenje::class);
    }


}
