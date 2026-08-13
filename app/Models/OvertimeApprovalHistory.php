<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OvertimeApprovalHistory extends Model
{
    protected $fillable = [
        'overtime_id',
        'approver_id',
        'level',
        'remarks',
    ];

    /**
     * History belongs to an overtime request.
     */
    public function overtime()
    {
        return $this->belongsTo(
            Personnelovertime::class,
            'overtime_id'
        );
    }

    /**
     * The employee who performed the return action.
     */
    public function approver()
    {
        return $this->belongsTo(
            PersonnelEmployee::class,
            'approver_id',
            'employee_id'
        );
    }
}
