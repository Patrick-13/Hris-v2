<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelDependent extends Model
{
    protected $fillable = ['employee_id', 'lastName', 'firstName', 'middleName', 'relationship', 'dateofBirth', 'status'];

    protected $cast = [
        "status" => 0,
    ];
}
