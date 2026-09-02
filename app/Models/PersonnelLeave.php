<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelLeave extends Model
{
    protected $fillable = [
        'id',
        'employee_id',
        'leave_type_id',
        'wellness_type',
        'activity_id',
        'reason',
        'leavespent',
        'start_date',
        'end_date',
        'leave_mode',
        'total_days',
        'request_status',
        'attachment_file',
        'created_at'
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function employeeBy()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }

    // A leave has many approvals
    public function approvals()
    {
        return $this->hasMany(LeaveApproval::class, 'leave_id');
    }

    // Easy access for section/division approvals
    public function sectionApproval()
    {
        return $this->hasOne(LeaveApproval::class, 'leave_id')->where('level', 'section');
    }

    public function divisionApproval()
    {
        return $this->hasOne(LeaveApproval::class, 'leave_id')->where('level', 'division');
    }

    public function refunds()
    {
        return $this->hasMany(LeaveRefund::class, 'leave_id');
    }

    public function leaveUsedLog()
    {
        return $this->hasOne(LeaveUsedLog::class);
    }
}
