<?php

namespace App\DTOs;

class JobData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $designation,
        public ?string $jobTitle,
        public ?string $employmentStatus,
        public ?string $jobCategory,
        public ?string $subUnit,
        public ?string $contractAttachement,
        public ?string $startDate,
        public ?string $endDate,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['designation'] ?? null,
            $data['jobTitle'] ?? null,
            $data['employmentStatus'] ?? null,
            $data['jobCategory'] ?? null,
            $data['subUnit'] ?? null,
            $data['contractAttachement'] ?? null,
            $data['startDate'] ?? null,
            $data['endDate'] ?? null
        );
    }
}
