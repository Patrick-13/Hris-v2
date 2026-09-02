<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class PersonnelOvertimeData
{
    public function __construct(
        public string $date_of_request,
        public string $purpose_of_overtime,
        public string $justification,
        public ?UploadedFile $attachment_file = null,
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
            $data['attachment_file'] ?? null,
            $data['employee_id'],
            $data['worktoaccomplishments'],
            $data['request_status'] ?? false,
        );
    }
}
