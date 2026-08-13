<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Iclockbiodata extends Model
{
    protected $table = 'iclock_biodata';

    protected $fillable = [
        "id",
        "employee_id",
        "status"
    ];

    public $timestamps = false;
}
