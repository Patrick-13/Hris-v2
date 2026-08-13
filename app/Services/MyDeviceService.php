<?php

namespace App\Services;

use App\Models\EmployeeDeviceAssignment;

class MyDeviceService
{

    public function getPersonnelDevices($employeeId, $sortField = 'created_at', $sortDirection = 'desc', $perPage = 10)
    {
        $query = EmployeeDeviceAssignment::with(['deviceBy', 'employeeBy'])
            ->where('employee_id', $employeeId);

        // ✅ Apply search filter here BEFORE paginate
        if (request()->filled('search')) {
            $search = request('search');

            $query->where(function ($q) use ($search) {
                $q->orWhereHas('deviceBy', function ($sub) use ($search) {
                    $sub->where('serial_number', 'like', "%{$search}%")
                        ->orWhere('property_number', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                    ;
                })->orWhere('remarks', 'like', "%{$search}%")
                    ->orWhere('assigned_at', 'like', "%{$search}%");
            });
        }

        // ✅ Sort and paginate after filtering
        return $query->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->onEachSide(1);
    }
}
