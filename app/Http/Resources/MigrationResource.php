<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MigrationResource extends JsonResource
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
            'documentAttachement' => $this->documentAttachement,
            'number' => $this->number,
            'issuedBy' => $this->issuedBy,
            'issuedDate' => $this->issuedDate,
            'expiryDate' => $this->expiryDate
        ];
    }
}
