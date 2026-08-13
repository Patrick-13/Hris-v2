<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelEducation extends Model
{
    protected $fillable = [
        'employee_id',
        'educationLevel',
        'schoolName',
        'degree',
        'yeargraduate',
        'highestlevel',
        'unitsEarned',
        'dateFrom',
        'dateTo',
        'scholarship_honors',
        'isGraduated'
    ];
}
