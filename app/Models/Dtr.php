<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dtr extends Model
{
    protected $fillable = [
        "id",
        "employee_id",
        "punch_date",
        "timeIn",
        "breakOut",
        "breakIn",
        "timeOut",
        "tardiness",
        "undertime",
        "overtime",
        "total_hours",
        "flexi_type",
    ];

    protected $casts = [
        'punch_date' => 'date',
    ];
    public function employeeTransaction()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function coordinates()
    {
        return $this->hasMany(DtrCoordination::class, 'dtr_id');
    }
}
