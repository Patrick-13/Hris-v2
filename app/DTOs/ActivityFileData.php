<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

class ActivityFileData
{
    public function __construct(
        public ?string $activity_id,
        public ?UploadedFile $activityFile = null, // ← change from ?array
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['activity_id'] ?? null,
            $data['activityFile'] ?? null, // this should now be UploadedFile
        );
    }

    public function toArray(): array
    {
        return [
            'activity_id' => $this->activity_id,
            'activityFile' => $this->activityFile,
        ];
    }
}
