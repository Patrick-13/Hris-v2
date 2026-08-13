<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TrainingFileResource extends JsonResource
{
        public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'training_id' => $this->training_id,
            'ilrFile' => $this->ilrFile,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
