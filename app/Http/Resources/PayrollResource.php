<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
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
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
            'deductions' => PayrollDeductionResource::collection($this->deductions),
            'payroll_from' => $this->payroll_from,
            'payroll_to' => $this->payroll_to,
            'monthly_rate' => $this->monthly_rate,
            'daily_rate' => $this->daily_rate,
            'days_worked' => $this->days_worked,
            'days_absent' => $this->days_absent,
            'total_late_hours' => $this->total_late_hours,
            'basic_pay' => $this->basic_pay,
            'premium' => $this->premium,
            'total_deductions' => $this->total_deductions,
            'net_pay' => $this->net_pay,
            'status' => $this->status,
        ];
    }
}
