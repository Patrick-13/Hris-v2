<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class TkoData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $tko_type,
        public ?string $date,
        public ?string $tko_time,
        public ?UploadedFile $attachment_file = null,
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['tko_type'] ?? null,
            $data['date'] ?? null,
            $data['tko_time'] ?? null,
            $data['attachment_file'] ?? null,
            $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'employee_id' => $this->employee_id,
            'tko_type' => $this->tko_type,
            'date' => $this->date,
            'tko_time' => $this->tko_time,
            'attachment_file' => $this->attachment_file,
            'remarks' => $this->remarks,
        ];
    }
}
