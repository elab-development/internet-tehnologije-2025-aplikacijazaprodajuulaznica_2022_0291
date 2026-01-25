<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    protected $table = 'rezervacije';

    protected $fillable = [
        'user_id',
        'ukupna_cena',
        'nacin_placanja',
        'status',
        'datum_kreiranja'
    ];

    protected $casts = [
        'datum_kreiranja' => 'date',
        'ukupna_cena' => 'decimal:2'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function stavke(){
        return $this->hasMany(StavkaRezervacije::class);
    }
}
