<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnelovertime extends Model
{
    protected $fillable = [
        'id',
        'date_of_request',
        'purpose_of_overtime',
        'justification',
        'employee_id',
        'work_to_accomplished',
        'duration_hours',
        'date_of_overtime',
        'request_status',
    ];

    protected $casts = [
        'date_of_request' => 'date',
        'date_of_overtime'   => 'date',
    ];

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function accomplishments()
    {
        return $this->hasMany(Overtime_accomplishment::class, 'overtime_id');
    }
    // A leave has many approvals
    public function approvals()
    {
        return $this->hasMany(OvertimeApproval::class, 'overtime_id');
    }

    // Easy access for section/division approvals
    public function sectionApproval()
    {
        return $this->hasOne(OvertimeApproval::class, 'overtime_id')->where('level', 'section');
    }

    public function divisionApproval()
    {
        return $this->hasOne(OvertimeApproval::class, 'overtime_id')->where('level', 'division');
    }

    public function approvalHistories()
    {
        return $this->hasMany(
            OvertimeApprovalHistory::class,
            'overtime_id'
        );
    }
}
