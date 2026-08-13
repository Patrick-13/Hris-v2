<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Downloadableform extends Model
{
    protected $fillable = ['name', 'description', 'form_type', 'dfFile'];



    public function formtypeBy()
    {
        return $this->belongsTo(Formtype::class, 'form_type');
    }
}
