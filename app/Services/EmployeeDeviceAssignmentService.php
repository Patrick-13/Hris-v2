<?php

namespace App\Services;

use App\DTOs\EmployeeDeviceAssignmentData;
use App\Models\EmployeeDeviceAssignment;
use App\Models\Device;
use Illuminate\Support\Facades\DB;

class EmployeeDeviceAssignmentService
{
    public function createDeviceAssignment(EmployeeDeviceAssignmentData $dto): EmployeeDeviceAssignment
    {
        return DB::transaction(function () use ($dto) {
            // ✅ Check if device exists
            $device = Device::findOrFail($dto->device_id);

            // ✅ Prevent assigning if no stock
            if ($device->quantity_physical_count <= 0) {
                throw new \Exception("Device '{$device->description}' is out of stock.");
            }

            // ✅ Create assignment
            $assignment = EmployeeDeviceAssignment::create([
                'employee_id' => $dto->employee_id,
                'device_id' => $dto->device_id,
                'device_careOf' => $dto->device_careOf,
                'assigned_at' => $dto->assigned_at ?? now()->toDateString(),
                'remarks' => $dto->remarks,
            ]);

            // ✅ Deduct 1 from quantity and refresh
            $device->decrement('quantity_physical_count', 1);
            $device->refresh();

            // ✅ Update status
            if ($device->quantity <= 0) {
                $device->update(['status' => 'unavailable']);
            } else {
                $device->update(['status' => 'partially assigned']);
            }

            return $assignment;
        });
    }


    public function updateDeviceAssignment(EmployeeDeviceAssignmentData $dto, int $id): EmployeeDeviceAssignment
    {
        return DB::transaction(function () use ($dto, $id) {
            $assignment = EmployeeDeviceAssignment::findOrFail($id);
            $device = Device::findOrFail($dto->device_id);

            $wasReturned = !is_null($assignment->returned_at);
            $isReturning = !is_null($dto->returned_at);

            // ✅ If marking returned, add quantity back
            if (!$wasReturned && $isReturning) {
                $device->increment('quantity_physical_count', 1);
                $device->update(['status' => 'available']);
            }

            $assignment->update([
                'employee_id' => $dto->employee_id,
                'device_id' => $dto->device_id,
                'device_careOf' => $dto->device_careOf,
                'assigned_at' => $dto->assigned_at,
                'returned_at' => $dto->returned_at,
                'remarks' => $dto->remarks,
            ]);

            return $assignment;
        });
    }

    public function markAsReturned(EmployeeDeviceAssignment $assignment): EmployeeDeviceAssignment
    {
        return DB::transaction(function () use ($assignment) {
            $assignment->update(['returned_at' => now()->toDateString()]);

            $device = Device::findOrFail($assignment->device_id);

            // ✅ Add 1 back to quantity
            $device->increment('quantity_physical_count', 1);

            // ✅ If now has stock, make available
            if ($device->quantity_physical_count > 0) {
                $device->update(['status' => 'available']);
            }

            return $assignment;
        });
    }

    public function delete(EmployeeDeviceAssignment $assignment): void
    {
        DB::transaction(function () use ($assignment) {
            $device = Device::find($assignment->device_id);

            // ✅ If deleted before being returned, restore quantity
            if ($device && is_null($assignment->returned_at)) {
                $device->increment('quantity_physical_count', 1);
                $device->update(['status' => 'available']);
            }

            $assignment->delete();
        });
    }
}
