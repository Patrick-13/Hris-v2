<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = ['name', 'default_entitlement'];

    public function leaveCreditsBy()
    {
        return $this->hasMany(LeaveCredit::class, 'leave_type_id');
    }

    public function leaveCreditLogs()
    {
        return $this->hasMany(LeaveCreditLog::class);
    }
}
