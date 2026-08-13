<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDeduction extends Model
{
    protected $fillable = [
        "id",
        "employee_id",
        "sss",
        "philhealth",
        "pagibig",
        "tax",
        "union_fee",
    ];

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
}
