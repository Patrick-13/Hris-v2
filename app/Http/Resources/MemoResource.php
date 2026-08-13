<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemoResource extends JsonResource
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
            'date_from' => $this->date_from,
            'date_to' => $this->date_to,
            'title' => $this->title,
            'status' => $this->status,
            'provinces' => $this->provinces,
            'memo_number' => $this->memo_number,
        ];
    }
}
