<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IclockTransaction extends Model
{
    protected $table = 'iclock_transaction';
    protected $fillable = [
        "emp_code",
        "punch_time",
        "punch_state",
        "area_alias",
        "is_attendance",
        "processed_at"

    ];

    public function employee_transaction()
    {
        return $this->belongsTo(Personnelemployeedevice::class, 'emp_code', 'emp_code');
    }

    public $timestamps = false;
}
