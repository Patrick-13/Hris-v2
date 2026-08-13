<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveCreditLog extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',

        'year',
        'month',

        'earned',
        'absent_days',
        'half_days',

        'before_balance',
        'after_balance',

        'tardiness_hours',
        'undertime_hours',
        'late_hours',
        'late_equivalent_days',

        'remarks',

        'activity_id',
        'credits',
        'action',

    ];

    protected $casts = [
        'earned' => 'decimal:3',
        'year' => 'integer',
        'month' => 'integer',
        'absent_days' => 'integer',
        'half_days' => 'integer',
        'tardiness_hours' => 'decimal:2',
        'undertime_hours' => 'decimal:2',
        'late_hours' => 'decimal:2',
        'late_equivalent_days' => 'decimal:3',
    ];

    public function employee()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }
}
