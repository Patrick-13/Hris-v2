<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalaryResource extends JsonResource
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
            'salarySchedule' => $this->salarySchedule,
            'payGrade' => $this->payGrade,
            'steps' => $this->steps,
            'amount' => $this->amount,
            'salaryComponent' => $this->salaryComponent,
            'payFrequency' => $this->payFrequency
        ];
    }
}
