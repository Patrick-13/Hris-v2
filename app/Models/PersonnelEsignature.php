<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelEsignature extends Model
{
    protected $fillable = ['employee_id', 'profilePicture', 'profileEsignature'];


    public function employee()
    {
        return $this->belongsTo(PersonnelEmployee::class, 'employee_id', 'employee_id');
    }
}
