<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usersubmodule extends Model
{
    protected $fillable = ['user_id', 'submodule_id'];

    public $timestamps = false;
}
