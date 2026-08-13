<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class TrainingFileData
{
    public function __construct(
        public ?string $employee_id,
        public ?string $training_id,
        public ?UploadedFile $ilrFile = null, // ← change from ?array
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['employee_id'] ?? null,
            $data['training_id'] ?? null,
            $data['ilrFile'] ?? null, // this should now be UploadedFile
        );
    }

    public function toArray(): array
    {
        return [
            'employee_id' => $this->employee_id,
            'training_id' => $this->training_id,
            'ilrFile' => $this->ilrFile,
        ];
    }
}
