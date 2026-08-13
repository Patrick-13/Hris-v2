<?php

namespace App\DTOs;

class PeronnelWorkExperienceData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $dateFrom,
        public ?string $dateTo,
        public ?string $jobTitle,
        public ?string $emp_status,
        public ?string $isGovernment,
        public ?string $department,
        public ?string $agency,
        public ?string $office,
        public ?string $company,
        public ?string $branch,
        public ?string $leave_absent,
        public ?string $monthysalary,
        public ?string $paycolumngrade,
        public ?string $separationCause,
        public ?string $isActive,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['dateFrom'] ?? null,
            $data['dateTo'] ?? null,
            $data['jobTitle'] ?? null,
            $data['emp_status'] ?? null,
            $data['isGovernment'] ?? null,
            $data['department'] ?? null,
            $data['agency'] ?? null,
            $data['office'] ?? null,
            $data['company'] ?? null,
            $data['branch'] ?? null,
            $data['leave_absent'] ?? null,
            $data['monthysalary'] ?? null,
            $data['paycolumngrade'] ?? null,
            $data['separationCause'] ?? null,
            $data['isActive'] ?? null,
        );
    }
}
