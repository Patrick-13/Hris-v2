<?php

namespace App\Exports;

use App\Models\LeaveCreditLog;
use Maatwebsite\Excel\Concerns\FromCollection;

class LeaveCardExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return LeaveCreditLog::all([
            'employee_id',
            'leave_type_id',
            'year',
            'month',
            'earned',
            'before_balance',
            'after_balance',
            'absent_days',
            'half_days',
            'tardiness_hours',
            'undertime_hours',
            'late_hours',
            'late_equivalent_days',
            'remarks',
        ]);
    }
}
