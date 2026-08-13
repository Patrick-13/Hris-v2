<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['sec_name', 'sec_code', 'div_id', 'sec_immediate_supervisor'];

    public function divisionBy()
    {
        return $this->belongsTo(Division::class, 'div_id');
    }

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'sec_immediate_supervisor', 'employee_id');
    }

    public function positions()
    {
        return $this->hasMany(Position::class, 'sec_id');
    }
}
