<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = ['id','post_name', 'post_code', 'sec_id'];

    public function sectionBy()
    {
        return $this->belongsTo(Section::class, 'sec_id');
    }

    public function employeeBy()
    {
        return $this->hasOne(EmployeeMovement::class, 'position_id', 'id');
    }

    // Position.php
    public function movements()
    {
        return $this->hasMany(EmployeeMovement::class, 'position_id');
    }

    public function employees()
    {
        return $this->hasManyThrough(
            PersonnelEmployee::class,
            EmployeeMovement::class,
            'position_id',      // FK on employee_movements
            'employee_id',      // FK on personnel_employees
            'id',               // Local key on positions
            'employee_id'       // Local key on employee_movements
        );
    }
}
