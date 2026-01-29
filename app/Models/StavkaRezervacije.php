<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StavkaRezervacije extends Model
{
    protected $table = 'stavke_rezervacije';
    
    protected $fillable = [
        'rezervacija_id',
        'karta_id',
        'cena_stavke',
        'kolicina'
    ];

    protected $casts = [
        'cena_stavke' => 'decimal:2'
    ];

    public function rezervacija(){
        return $this->belongsTo(Rezervacija::class);
    }

    public function karta(){
        return $this->belongsTo(Karta::class);
    }

}
