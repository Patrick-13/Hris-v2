<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveApproval extends Model
{
    protected $fillable = [
        'leave_id',
        'approver_id',
        'level',
        'status',
        'remarks',
        'pending_at',
        'approved_at',
    ];

    protected $casts = [
        'pending_at' => 'datetime',
        'approved_at' => 'datetime',
    ];


    // Approval belongs to a leave
    public function leave()
    {
        return $this->belongsTo(PersonnelLeave::class, 'leave_id');
    }

    // Approver is an employee
    public function approver()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'approver_id', 'employee_id');
    }
}
