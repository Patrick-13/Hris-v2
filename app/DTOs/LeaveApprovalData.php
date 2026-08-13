<?php

namespace App\DTOs;

class LeaveApprovalData
{
    public function __construct(
        public int $leave_id,
        public string $approver_id,
        public string $level,   // 'section' | 'division'
        public string $status = 'pending',
        public ?string $remarks = null,
        public ?string $pending_at = null,
        public ?string $approved_at = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['leave_id'],
            $data['approver_id'],
            $data['level'],
            $data['status'] ?? 'pending',
            $data['remarks'],
            $data['pending_at'] ?? null,
            $data['approved_at'] ?? null,
        );
    }
}
