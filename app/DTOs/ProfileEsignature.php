<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class ProfileEsignature
{
    public function __construct(
        public ?int $employee_id,
        public ?UploadedFile $profilePicture = null,
        public ?UploadedFile $profileEsignature = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(

            $data['employee_id'] ?? null,
            $data['profilePicture'] ?? null,
            $data['profileEsignature'] ?? null,
        );
    }
}
