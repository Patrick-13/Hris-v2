<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class DownloadableFormData
{
    public function __construct(
        public ?string $name,
        public ?string $description,
        public ?string $form_type,
        public ?UploadedFile $dfFile = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'] ?? null,
            $data['description'] ?? null,
            $data['form_type'] ?? null,
            $data['dfFile'] ?? null,
        );
    }
}
