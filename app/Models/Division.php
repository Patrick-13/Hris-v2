<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $fillable = ['div_name', 'div_code', 'immediate_supervisor'];

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'immediate_supervisor', 'employee_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'div_id');
    }
}
