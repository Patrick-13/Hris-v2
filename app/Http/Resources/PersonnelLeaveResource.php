<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelLeaveResource extends JsonResource
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
            'approvals'  => LeaveApprovalResource::collection($this->approvals),
            'leaveType' => new LeaveTypeResource($this->leaveType),
            'refunds' =>  LeaveRefundResource::collection($this->refunds),
            'leavespent' => $this->leavespent,
            'reason' => $this->reason,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'leave_mode' => $this->leave_mode,
            'request_status' => $this->request_status,
            'created_at' => $this->created_at
        ];
    }
}
