<?php

namespace App\Services;

use App\DTOs\LeaveApprovalData;
use App\DTOs\PersonnelLeaveData;
use App\Models\Division;
use App\Models\EmployeeMovement;
use App\Models\LeaveApproval;
use App\Models\LeaveCredit;
use App\Models\PersonnelLeave;
use App\Models\Position;
use Illuminate\Support\Facades\Auth;

class EmployeeLeaveService
{
    public function createLeave(PersonnelLeaveData $data): PersonnelLeave
    {
        $leave = PersonnelLeave::create($data->toArray());

        $this->createApprovalsForLeave($leave);

        return $leave;
    }



    public function updateLeave(PersonnelLeaveData $data, int $id): PersonnelLeave
    {
        $leave  = PersonnelLeave::findOrFail($id);

        $leave->update($data->toArray());

        return $leave;
    }

    private function createApprovalsForLeave(PersonnelLeave $leave): void
    {
        $movement = EmployeeMovement::where('employee_id', $leave->employee_id)
            ->latest()
            ->first();

        if (!$movement) return;

        $employeeId = $leave->employee_id;
        $isORD = $movement->divisionBy && stripos($movement->divisionBy->div_name, 'ORD') !== false;

        // ✅ 1. Special case: CTO leave → HR only
        if ($leave->leave_type_id == 3) {
            $hrOfficer = Position::where('post_name', 'like', '%Human Resource Management Officer%')->first();
            if ($hrOfficer?->employeeBy?->employee_id) {
                $approval = $this->storeApproval(new LeaveApprovalData($leave->id, $hrOfficer->employeeBy->employee_id, 'hr'));

                $approval->update([
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            }
            return;
        }

        // Get approvers
        $sectionChief = $movement->sectionBy?->employeeBy?->employee_id;
        $divisionChief = $movement->divisionBy?->employeeBy?->employee_id;
        $regionalDirector = Division::where('div_name', 'ORD')->first()?->employeeBy?->employee_id;
        $isSameApprover = $sectionChief && $divisionChief && $sectionChief === $divisionChief;

        // Division Chief applies → only RD approves
        if ($employeeId === $divisionChief && $regionalDirector) {
            $approval = $this->storeApproval(new LeaveApprovalData($leave->id, $regionalDirector, 'rd'));

            $approval->update([
                'status' => 'pending',
                'pending_at' => now(),
            ]);
            return; // skip normal approval flow
        }

        $approvers = [];

        // 2️⃣ Section Chief applies leave → skip themselves
        if ($employeeId !== $sectionChief && $sectionChief && !$isSameApprover) {
            $approvers[] = [
                'id' => $sectionChief,
                'type' => 'unit/section chief'
            ];
        }


        // ✅ Special approval flow for Leave Type 9
        if ($leave->leave_type_id == 9) {

            if ($isORD) {
                // ORD employees → Section Chief + RD
                if ($regionalDirector) {
                    $approvers[] = [
                        'id' => $regionalDirector,
                        'type' => 'rd'
                    ];
                }
            } else {
                // Non-ORD employees → Section Chief + Division Chief
                if ($divisionChief) {
                    $approvers[] = [
                        'id' => $divisionChief,
                        'type' => 'division chief'
                    ];
                }
            }
        } else {

            // Division Chief
            if (!$isORD && $divisionChief) {
                $approvers[] = [
                    'id' => $divisionChief,
                    'type' => 'division chief'
                ];
            }

            // Regional Director
            if ($regionalDirector) {
                $approvers[] = [
                    'id' => $regionalDirector,
                    'type' => 'rd'
                ];
            }
        }

        $approvers = collect($approvers)
            ->reverse()
            ->unique('id')
            ->reverse()
            ->values()
            ->all();

        // Store all approvals
        foreach ($approvers as $index => $approver) {

            $approval = $this->storeApproval(
                new LeaveApprovalData(
                    $leave->id,
                    $approver['id'],
                    $approver['type']
                )
            );

            // First approver = active
            if ($index === 0) {
                $approval->update([
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            } else {
                $approval->update([
                    'status' => 'waiting',
                    'pending_at' => null,
                ]);
            }
        }
    }



    public function storeApproval(LeaveApprovalData $data): LeaveApproval
    {
        return LeaveApproval::create([
            'leave_id'    => $data->leave_id,
            'approver_id' => $data->approver_id,
            'level'       => $data->level,
            'status'      => $data->status,
            'approved_at' => $data->approved_at,
        ]);
    }

    public function approveLeave($leaveId, $status, $remarks)
    {
        $approverId = Auth::user()->employee_id;

        // Find the approval record
        $approval = LeaveApproval::where('leave_id', $leaveId)
            ->where('approver_id', $approverId)
            ->firstOrFail();

        // Update current approval
        $approval->update([
            'status' => $status,
            'approved_at' => now(),
            'pending_at' => null,
        ]);

        $personnelLeave = $approval->leave;

        if ($status === 'rejected') {

            $approval->update([
                'remarks' => $remarks,
            ]);
            //cancel all remaining waiting approvals
            LeaveApproval::where('leave_id', $leaveId)
                ->where('status', 'waiting')
                ->update([
                    'status' => 'cancelled',
                    'pending_at' => null,
                ]);

            return true;
        }

        // Move to the next approver
        if (in_array($status, ['approved', 'auto-approved'])) {

            $next = LeaveApproval::where('leave_id', $leaveId)
                ->where('status', 'waiting')
                ->orderBy('id')
                ->first();

            if ($next) {
                $next->update([
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            }
        }

        // Check if all approvers have finished
        $allApproved = $personnelLeave->approvals()
            ->whereNotIn('status', ['approved', 'auto-approved'])
            ->doesntExist();

        if ($allApproved) {
            $this->finalizeLeaveApproval($personnelLeave);
        }

        return true;
    }

    public function finalizeLeaveApproval(PersonnelLeave $personnelLeave)
    {
        // Prevent double deduction
        if ($personnelLeave->request_status === 'approved') {
            return;
        }

        $personnelLeave->update([
            'request_status' => 'approved',
        ]);

        $employee = $personnelLeave->employeeBy;

        $deductionRate = 1;

        if ($employee) {
            if ($employee->flexi_type === 'FWA-A') {
                $deductionRate = 1;
            } elseif ($employee->flexi_type === 'FWA-B') {
                $deductionRate = 1.25;
            }
        }

        $isHalfLeave = in_array($personnelLeave->leave_type_id, [9, 10])
            && $personnelLeave->leave_mode === 'half';

        if ($isHalfLeave) {
            $deductedDays = 0.5 * $deductionRate;
        } else {
            $days = $personnelLeave->total_days;
            $deductedDays = $days * $deductionRate;
        }

        $leaveCredit = LeaveCredit::where('employee_id', $personnelLeave->employee_id)
            ->where('leave_type_id', $personnelLeave->leave_type_id)
            ->where('year', now()->year)
            ->first();

        if ($leaveCredit) {
            $leaveCredit->increment('used', $deductedDays);

            $leaveCredit->refresh();

            $leaveCredit->update([
                'balance' => $leaveCredit->entitled - $leaveCredit->used,
            ]);
        }
    }
}
