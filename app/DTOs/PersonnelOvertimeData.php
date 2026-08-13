<?php

namespace App\DTOs;

class PersonnelOvertimeData
{
    public function __construct(
        public string $date_of_request,
        public string $purpose_of_overtime,
        public string $justification,
        public string $employee_id,
        public array $worktoaccomplishments,
        public ?bool $request_status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['date_of_request'],
            $data['purpose_of_overtime'],
            $data['justification'],
            $data['employee_id'],
            $data['worktoaccomplishments'],
            $data['request_status'] ?? false,
        );
    }
}
