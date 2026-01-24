<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Predstava extends Model
{
    protected $table = 'predstave';

    protected $fillable = [
        'naziv',
        'opis',
        'reditelj',
        'trajanje_min',
        'img_url'
    ];

    protected $casts = [
        'trajanje_min' => 'integer'
    ];

    public function izvodjenja(){
        return $this->hasMany(Izvodjenje::class);
    }
    
}
