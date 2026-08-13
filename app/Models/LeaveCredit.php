<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveCredit extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'year',
        'entitled',
        'used',
        'balance'
    ];


    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function leaveTypeBy()
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }
}
