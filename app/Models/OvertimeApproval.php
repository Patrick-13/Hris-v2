<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OvertimeApproval extends Model
{
    protected $fillable = [
        'overtime_id',
        'approver_id',
        'level',
        'status',
        'remarks',
        'approved_at',
    ];

    // Approval belongs to a overtime
    public function overtime()
    {
        return $this->belongsTo(Personnelovertime::class, 'overtime_id');
    }

    // Approver is an employee
    public function approver()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'approver_id', 'employee_id');
    }
}
