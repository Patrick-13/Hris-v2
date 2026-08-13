<?php

namespace App\DTOs;

class EducationData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $educationLevel,
        public ?string $schoolName,
        public ?string $degree,
        public ?string $yeargraduate,
        public ?string $highestlevel,
        public ?string $unitsEarned,
        public ?string $dateFrom,
        public ?string $dateTo,
        public ?string $scholarship_honors,
        public ?string $isGraduated,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['educationLevel'] ?? null,
            $data['schoolName'] ?? null,
            $data['degree'] ?? null,
            $data['yeargraduate'] ?? null,
            $data['highestlevel'] ?? null,
            $data['unitsEarned'] ?? null,
            $data['dateFrom'] ?? null,
            $data['dateTo'] ?? null,
            $data['scholarship_honors'] ?? null,
            $data['isGraduated'] ?? null
        );
    }
}
