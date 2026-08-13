<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accomplishment_approval extends Model
{
    protected $fillable = [
        'accomplishment_id',
        'approver_id',
        'level',
        'status',
        'revision_no',
        'resubmitted_at',
        'returned_at',
        'remarks',
        'approved_at',
    ];

    // Approval belongs to a overtime
    public function accomplishment()
    {
        return $this->belongsTo(Overtime_accomplishment::class, 'accomplishment_id');
    }

    // Approver is an employee
    public function approver()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'approver_id', 'employee_id');
    }
}
