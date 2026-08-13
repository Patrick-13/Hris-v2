<?php

namespace App\DTOs;

class PersonnelLeaveData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $leave_type_id,
        public ?string $leave_mode,
        public ?float $total_days,
        public ?string $activity_id,
        public ?string $leavespent,
        public ?string $reason,
        public ?string $start_date,
        public ?string $end_date,
        public ?string $request_status,

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['leave_type_id'] ?? null,
            $data['leave_mode'] ?? null,
            $data['total_days'] ?? null,
            $data['activity_id'] ?? null,
            $data['leavespent'] ?? null,
            $data['reason'] ?? null,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
            $data['request_status'] ?? null,

        );
    }

    public function toArray(): array
    {
        return [
            'employee_id' => $this->employee_id,
            'leave_type_id' => $this->leave_type_id,
            'leave_mode' => $this->leave_mode,
            'total_days' => $this->total_days,
            'activity_id' => $this->activity_id,
            'leavespent' => $this->leavespent,
            'reason' => $this->reason,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'request_status' => $this->request_status,
        ];
    }
}
