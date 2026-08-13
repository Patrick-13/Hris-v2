<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $fillable = [
        'office_code',
        'office_name',
        'address',
        'latitude',
        'longitude',
        'radius',
        'is_active',
    ];


    public function employees()
    {
        return $this->belongsToMany(PersonnelEmployee::class, 'employee_office');
    }
}
