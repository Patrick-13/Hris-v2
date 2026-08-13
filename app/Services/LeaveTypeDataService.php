<?php

namespace App\Services;

use App\DTOs\LeaveTypeData;
use App\Models\LeaveType;

class LeaveTypeDataService
{
    public function createLeaveType(LeaveTypeData $data): LeaveType
    {
        return LeaveType::create([
            'name' => $data->name,
            'default_entitlement' => $data->default_entitlement,
        ]);
    }

    public function updateLeaveType(LeaveTypeData $data, int $id): LeaveType
    {
        $leavetype = LeaveType::findOrFail($id);

        $leavetype->update([
            'name' => $data->name,
            'default_entitlement' => $data->default_entitlement,
        ]);

        return $leavetype;
    }

    public function deleteLeaveType(int $id): bool
    {
        $leavetype = LeaveType::findOrFail($id);
        return $leavetype->delete(); // returns true if deleted
    }
}
