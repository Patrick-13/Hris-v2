<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelWorkexperience extends Model
{
    protected $fillable = [
        'employee_id',
        'dateFrom',
        'dateTo',
        'jobTitle',
        'emp_status',
        'isGovernment',
        'department',
        'agency',
        'office',
        'company',
        'branch',
        'leave_absent',
        'monthysalary',
        'paycolumngrade',
        'separationCause',
        'isActive'
    ];
}
