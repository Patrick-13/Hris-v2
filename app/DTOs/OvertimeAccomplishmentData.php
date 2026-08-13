<?php

namespace App\DTOs;
use Illuminate\Http\UploadedFile;
class OvertimeAccomplishmentData
{
    public function __construct(
        public ?int $overtime_id,
        public ?string $work_accomplished,
        public ?float $duration_hours,
        public ?UploadedFile $attachment = null,
    ) {}

    public static function fromArray(array $data, int $overtimeId): self
    {
        return new self(
            $overtimeId,
            $data['work_accomplished'] ?? null,
            isset($data['duration_hours']) ? (float)$data['duration_hours'] : null,
            $data['attachment'] ?? null,
        );
    }
}
