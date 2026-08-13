<?php

namespace App\DTOs;

class TkoApprovalData
{
    public function __construct(
        public int $tko_id,
        public string $approver_id,
        public string $level,
        public string $status = 'pending',
        public ?string $approved_at = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['tko_id'],
            $data['approver_id'],
            $data['level'],
            $data['status'] ?? 'pending',
            $data['approved_at'] ?? null,
        );
    }
}
