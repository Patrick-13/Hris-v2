<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll_deduction extends Model
{
    protected $fillable = [
        'payroll_id',
        'type',
        'amount',
    ];
}
