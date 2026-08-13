<?php

namespace App\DTOs;

class OvertimeApprovalData
{
    public function __construct(
        public int $overtime_id,
        public string $approver_id,
        public string $level,   // 'section' | 'division'
        public string $status = 'pending',
        public ?string $approved_at = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['overtime_id'],
            $data['approver_id'],
            $data['level'],
            $data['status'] ?? 'pending',
            $data['approved_at'] ?? null,
        );
    }
}
