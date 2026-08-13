<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelOrder extends Model
{
    protected $fillable = [
        'travel_id',
        'employee_id',
        'employee_name',
        'employee_division',
        'employee_section',
        'employee_designation',
        'travel_scope',
        'travel_type',
        'travel_applied_date',
        'travel_departure_date',
        'travel_return_date',
        'travel_official_station',
        'travel_destination',
        'travel_purpose',
        'travel_pier_diem',
        'travel_assistant',
        'travel_remarks',
        'travel_report_submission',
        'travel_application_status',
    ];

    protected $casts = [
        'travel_applied_date' => 'date',
        'travel_departure_date' => 'date',
        'travel_return_date' => 'date',
        'travel_report_submission' => 'date',
    ];
}
