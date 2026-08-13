<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Userloginlog extends Model
{
    protected $fillable = [
        "user_id",
        "user_email",
        "user_ip",
        "action",
    ];
}
