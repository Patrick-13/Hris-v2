<?php

namespace App\DTOs;

class AccomplishmentApprovalData
{
    public function __construct(
        public int $accomplishment_id,
        public string $approver_id,
        public string $level,   // 'section' | 'division'
        public string $status = 'pending',
        public ?string $approved_at = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['accomplishment_id'],
            $data['approver_id'],
            $data['level'],
            $data['status'] ?? 'pending',
            $data['approved_at'] ?? null,
        );
    }
}
