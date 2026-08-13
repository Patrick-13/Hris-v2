<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coc_credit extends Model
{
    protected $fillable = [
        'employee_id',
        'year',
        'entitled',
        'used',
        'balance'
    ];


    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
}
