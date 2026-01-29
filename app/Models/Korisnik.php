<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Korisnik extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'korisnici'; 

    protected $fillable = [
        'email',
        'korisnicko_ime', 
        'lozinka',  
        'uloga' // admin ili klijent
    ];

    protected $hidden = [
        'lozinka',
        'remember_token',
    ];

    // Moramo reći da se lozinka zove 'lozinka' da bi Auth radio
    public function getAuthPassword()
    {
        return $this->lozinka;
    }

    protected function casts(): array
    {
        return [
            'lozinka' => 'hashed',
        ];
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'korisnik_id');
    }

    public function isAdmin(): bool
    {
        return $this->uloga === 'admin';
    }

    public function isKlijent(): bool
    {
        return $this->uloga === 'klijent';
    }
}