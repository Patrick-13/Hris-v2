<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'id',
        'employee_id',
        'payroll_from',
        'payroll_to',
        'monthly_rate',
        'daily_rate',
        'days_worked',
        'days_absent',
        'total_late_hours',
        'basic_pay',
        'premium',
        'total_deductions',
        'net_pay',
        'status',
    ];

    public function deductions()
    {
        return $this->hasMany(Payroll_deduction::class, 'payroll_id', 'id');
    }

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
}
