<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRefund extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_id',
        'refund_date',
        'days_refunded',
        'reason',
    ];
}
