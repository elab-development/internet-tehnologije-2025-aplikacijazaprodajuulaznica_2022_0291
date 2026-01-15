<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Korisnik extends Model
{
    protected $table = 'korisnici';

    //Polja koja ce korisnik moci da unese 
    protected $fillable = [
        'email',
        'username',
        'password',
        'uloga'
    ];

    public function korisnik(){
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

}
