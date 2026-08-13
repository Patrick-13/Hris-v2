<?php

namespace App\DTOs;

class PersonnelEligibilityLicensesData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $cse,
        public ?string $rating,
        public ?string $placeExamTaken,
        public ?string $dateTaken,
        public ?string $profLicenseNumber,
        public ?string $dateRelease,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['cse'] ?? null,
            $data['rating'] ?? null,
            $data['placeExamTaken'] ?? null,
            $data['dateTaken'] ?? null,
            $data['profLicenseNumber'] ?? null,
            $data['dateRelease'] ?? null,
        );
    }
}
