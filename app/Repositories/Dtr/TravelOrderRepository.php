<?php

namespace App\Repositories\Dtr;

use App\Models\TravelOrder;

class TravelOrderRepository
{
    public function getByEmployeeAndRange($iisEmployeeId, $dateFrom, $dateTo)
    {
        return TravelOrder::where('employee_id', $iisEmployeeId)
            ->where(function ($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('travel_departure_date', [$dateFrom, $dateTo])
                    ->orWhereBetween('travel_return_date', [$dateFrom, $dateTo])
                    ->orWhere(function ($q2) use ($dateFrom, $dateTo) {
                        $q2->where('travel_departure_date', '<=', $dateFrom)
                            ->where('travel_return_date', '>=', $dateTo);
                    });
            })
            ->get();
    }
}
