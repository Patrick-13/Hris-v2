<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveUsedLog extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'personnel_leave_id',
        'entitled',
        'used',
        'balance',
    ];

    public function personnelLeave()
    {
        return $this->belongsTo(PersonnelLeave::class);
    }
}
