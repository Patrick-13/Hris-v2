<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DtrCoordination extends Model
{
    protected $fillable = [
        'dtr_id',
        'employee_id',
        'type',
        'photo_path',
        'latitude',
        'longitude',
    ];

    public function dtr()
    {
        return $this->belongsTo(Dtr::class);
    }

    public function employee()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
}
