<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'korisnici'; 

    protected $fillable = [
        'email',
        'username',
        'password',
        'uloga'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class);
    }

    public function isAdmin(): bool
    {
        return $this->uloga === 'ADMIN';
    }

    public function isKorisnik(): bool
    {
        return $this->uloga === 'KORISNIK';
    }
}
