<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelOvertimeResource extends JsonResource
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
            'date_of_request' => $this->date_of_request,
            'purpose_of_overtime' => $this->purpose_of_overtime,
            'justification' => $this->justification,
            'attachment_file' => $this->attachment_file,
            'employeeBy' => new PersonnelEmployeeResource($this->employeeBy),
            'approvals'  => OvertimeApprovalResource::collection($this->approvals),
            'accomplishments' => OvertimeAccomplishmentResource::collection($this->accomplishments),
            'approvalHistories' => OvertimeReturnHistoryResource::collection($this->approvalHistories),
            'work_to_accomplished' => $this->work_to_accomplished,
            'duration_hours' => $this->duration_hours,
            'date_of_overtime' => $this->date_of_overtime,
            'request_status' => $this->request_status,
        ];
    }
}
