<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityFiles extends Model
{
    protected $fillable = [
        'activity_id',
        'activityFile',
    ];


    public function attendance()
    {
        return $this->belongsTo(ActivityEmployees::class, 'activity_id');
    }
}
