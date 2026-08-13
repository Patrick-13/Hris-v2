<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usermodule extends Model
{
    protected $fillable = ['user_id', 'module_id'];

    public $timestamps = false;
}
