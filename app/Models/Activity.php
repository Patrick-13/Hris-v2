<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'id',
        'title_id',
        'soNumber',
        'dateFrom',
        'dateTo',
        'noofHours',
        'type',
        'venue',
        'description',
        'with_coc'
    ];

    public function employees()
    {
        return $this->belongsToMany(PersonnelEmployee::class, 'activity_employees', 'activity_id', 'employee_id', 'id', 'employee_id');
    }

    public function activityTypeBy()
    {
        return $this->belongsTo(ActivityType::class, 'title_id');
    }

    public function personnelLeaves()
    {
        return $this->hasMany(PersonnelLeave::class, 'activity_id', 'id');
    }

    public function activityFileBy()
    {
        return $this->hasOne(ActivityFiles::class,  'activity_id','id');
    }
    
}
