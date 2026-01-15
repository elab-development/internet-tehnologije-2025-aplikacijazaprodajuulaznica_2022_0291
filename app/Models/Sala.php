<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    protected $table = 'sale';

    protected $fillable = [
        'naziv',
        'kapacitet'
    ];

    protected $casts = [
        'kapacitet' => 'integer'
    ];

}
