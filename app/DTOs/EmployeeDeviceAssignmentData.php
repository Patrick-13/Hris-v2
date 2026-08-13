<?php

namespace App\DTOs;

class EmployeeDeviceAssignmentData
{
    public function __construct(
        public readonly string $employee_id,
        public readonly int $device_id,
        public readonly string $device_careOf,
        public readonly ?string $assigned_at,
        public readonly ?string $returned_at,
        public readonly ?string $remarks,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            employee_id: $data['employee_id'],
            device_id: (int)$data['device_id'],
            device_careOf: $data['device_careOf'],
            assigned_at: $data['assigned_at'] ?? null,
            returned_at: $data['returned_at'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }
}
