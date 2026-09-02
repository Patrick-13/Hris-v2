<?php

namespace App\Services;

use App\DTOs\AccomplishmentApprovalData;
use App\DTOs\OvertimeAccomplishmentData;
use App\Models\Accomplishment_approval;
use App\Models\Division;
use App\Models\EmployeeMovement;
use App\Models\Holiday;
use App\Models\LeaveCredit;
use App\Models\LeaveCreditLog;
use App\Models\Overtime_accomplishment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OvertimeAccomplishmentService
{
    public function createOTAccomplishment(OvertimeAccomplishmentData $data): Overtime_accomplishment
    {
        $path = null;

        if ($data->attachment) {
            $file = $data->attachment;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "aro_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs("aro/{$folder}", $filename, 'network');
        }



        $overtimeaccomplishment =  Overtime_accomplishment::create([
            'overtime_id' => $data->overtime_id,
            'work_accomplished' => $data->work_accomplished,
            'duration_hours' => $data->duration_hours,
            'attachment' => $path ? $path : null,
        ]);

        $this->createApprovalsForAccomplishment($overtimeaccomplishment);

        return $overtimeaccomplishment;
    }

    public function updateOTAccomplishment(OvertimeAccomplishmentData $data, int $id): Overtime_accomplishment
    {

        $path = null;

        if ($data->attachment) {
            $file = $data->attachment;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "aro_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs("aro/{$folder}", $filename, 'network');
        }

        $overtimeaccomplishment = Overtime_accomplishment::findOrFail($id);

        $overtimeaccomplishment->update([
            'overtime_id' => $data->overtime_id,
            'work_accomplished' => $data->work_accomplished,
            'duration_hours' => $data->duration_hours,
            'attachment' => $path ? $path : null,
        ]);

        return $overtimeaccomplishment;
    }

    private function createApprovalsForAccomplishment(Overtime_accomplishment $accomplishment): void
    {
        $overtime = $accomplishment->overtime;

        if (!$overtime || !$overtime->employee_id) {
            Log::warning('Missing overtime or employee', [
                'accomplishment_id' => $accomplishment->id
            ]);
            return;
        }

        $movement = EmployeeMovement::where('employee_id', $overtime->employee_id)
            ->latest()
            ->first();

        if (!$movement) {
            Log::warning('No employee movement found', [
                'employee_id' => $overtime->employee_id
            ]);
            return;
        }

        $employeeId = $accomplishment->employee_id;

        // Check if the employee belongs to the ORD division.
        // ORD employees skip Division Chief approval.
        $isORD = $movement->divisionBy &&
            stripos($movement->divisionBy->id, 1) !== false;

        // Get approvers
        $sectionChief = $movement->sectionBy?->employeeBy?->employee_id;
        $divisionChief = $movement->divisionBy?->employeeBy?->employee_id;
        $regionalDirector = Division::where('id', 1)->first()?->employeeBy?->employee_id;
        $hrOfficer = "0153";

        // True when the Section Chief and Division Chief are the same person.
        // In this case, only one approval is needed before the Regional Director.
        $isSameApprover = $sectionChief && $divisionChief && $sectionChief === $divisionChief;

        // If the applicant is the Division Chief,
        // send the request directly to the Regional Director.
        if ($employeeId === $divisionChief && $regionalDirector) {
            $approval = $this->storeAccomplishmentApproval(new AccomplishmentApprovalData($accomplishment->id, $regionalDirector, 'rd'));

            $approval->update([
                'status' => 'pending',
                'pending_at' => now(),
            ]);
            return;
        }

        $approvers = [];

        if ($hrOfficer) {
            $approvers[] = [
                'id' => $hrOfficer,
                'type' => 'hr'
            ];
        }

        // Add Section Chief approval unless:
        // - the applicant is the Section Chief, or
        // - the Section Chief and Division Chief are the same person
        //   (to avoid duplicate approvals).
        if ($employeeId !== $sectionChief && $sectionChief && !$isSameApprover) {
            $approvers[] = [
                'id'   => $sectionChief,
                'type' => 'section/unit'
            ];
        }


        // Add Division Chief approval unless the employee belongs to ORD.
        // If the Section Chief and Division Chief are the same person,
        // this serves as their single approval.
        if (!$isORD && $divisionChief) {
            $approvers[] = [
                'id'   => $divisionChief,
                'type' => 'division'
            ];
        }

        // Regional Director is always the final approver.
        if ($regionalDirector) {
            $approvers[] = [
                'id' => $regionalDirector,
                'type' => 'rd'
            ];
        }

        // Store approval records.
        // First approver is set to pending, remaining approvers wait their turn.
        foreach ($approvers as $index => $approver) {

            // 🔥 PREVENT DUPLICATE APPROVALS
            $exists = Accomplishment_approval::where('accomplishment_id', $accomplishment->id)
                ->where('approver_id', $approver['id'])
                ->exists();

            if ($exists) {
                continue;
            }

            // 🔥 CREATE APPROVAL (ALWAYS WAITING FIRST)
            $approval = $this->storeAccomplishmentApproval(
                new AccomplishmentApprovalData(
                    $accomplishment->id,   // ✅ FIXED: use accomplishment_id
                    $approver['id'],
                    $approver['type']
                )
            );

            // 🔥 FIRST APPROVER = ACTIVE
            if ($index === 0) {
                $approval->update([
                    'status' => 'pending',
                    'approved_at' => null,
                ]);
            } else {
                $approval->update([
                    'status' => 'waiting',
                    'approved_at' => null,
                ]);
            }
        }
    }

    public function storeAccomplishmentApproval(AccomplishmentApprovalData $data): Accomplishment_approval
    {
        return Accomplishment_approval::create([
            'accomplishment_id'    => $data->accomplishment_id,
            'approver_id' => $data->approver_id,
            'level'       => $data->level,
            'status'      => $data->status,
            'approved_at' => $data->approved_at,
        ]);
    }

    public function approveAccomplishment($accomplishmentId, $status, $remarks)
    {

        $approverId = Auth::user()->employee_id;

        // Retrieve the logged-in user's approval record for this accomplishment.
        // Only approvals with "pending" status can be processed to enforce
        // the approval sequence (Section -> Division -> RD).
        $approval = Accomplishment_approval::where('accomplishment_id', $accomplishmentId)
            ->where('approver_id', $approverId)
            ->first();

        if (!$approval) {
            return redirect()->back()->with(
                'error',
                'Approval record not found.'
            );
        }

        if (!in_array($approval->status, ['pending', 'resubmitted'])) {
            return redirect()->back()->with(
                'error',
                'This approval is not available.'
            );
        }

        // Prepare fields to update based on the action taken.
        $updateData = ['status' => $status];

        // Record the approval timestamp.
        if ($status === 'approved') {
            $updateData['approved_at'] = now();
            $updateData['returned_at'] = null;
        }

        if ($status === 'returned') {
            $updateData['returned_at'] = now();
            $updateData['approved_at'] = null;
            $updateData['remarks'] = $remarks;
        }

        // Update the current approval record.
        $approval->update($updateData);

        $accomplishment = $approval->accomplishment;

        if (!$accomplishment) {
            return redirect()->back()->with(
                'error',
                'Accomplishment record not found.'
            );
        }

        if ($status === 'returned') {

            // Update parent accomplishment
            $accomplishment->update([
                'status' => 'returned',
                'approved_at' => null,
                'remarks' => $remarks,
                'returned_at' => now(),
            ]);

            // Update remarks on overtime approval
            if ($accomplishment->overtimeApproval) {
                $accomplishment->overtimeApproval->update([
                    'status' => 'returned',
                    'remarks' => $remarks,
                    'returned_at' => now(),
                ]);
            }

            // Get all approval records for this accomplishment
            $approvals = Accomplishment_approval::where(
                'accomplishment_id',
                $accomplishment->id
            )
                ->orderBy('level')
                ->get();

            /*
         * The approver who returned it remains "returned".
         * Everyone else goes back to "waiting".
         */
            foreach ($approvals as $approvalItem) {

                if ($approvalItem->id != $approval->id) {
                    $approvalItem->update([
                        'status' => 'waiting',
                        'approved_at' => null,
                        'returned_at' => null,
                    ]);
                }
            }

            return true;
        }


        // Activate the next approver in the approval hierarchy.
        // The next approver is the first record with "waiting" status,
        // ordered by approval level.
        $next = Accomplishment_approval::where('accomplishment_id', $accomplishment->id)
            ->where('status', 'waiting')
            ->orderBy('level')
            ->first();

        if ($next) {
            Log::info('Activating next approver', [
                'accomplishment_id' => $accomplishment->id,
                'next_approver' => $next->approver_id
            ]);

            $next->update([
                'status' => 'pending'
            ]);
        }

        // Check whether every approver has already approved.
        // If no approval records remain with a status other than "approved",
        // the accomplishment is considered fully approved.
        $allApproved = Accomplishment_approval::where('accomplishment_id', $accomplishment->id)
            ->whereNotIn('status', ['approved'])
            ->doesntExist();

        if ($allApproved) {
            $accomplishment->update([
                'status' => 'approved',
            ]);
            // Grant compensatory credits once the approval process is complete.
            $this->grantCompensatoryCredits($accomplishment);
        }

        return true;
    }

    private function grantCompensatoryCredits(Overtime_accomplishment $accomplishment)
    {
        try {

            $overtime = $accomplishment->overtime;

            if (!$overtime || !$overtime->employee_id) {
                Log::warning("⚠️ No employee linked to overtime ID {$accomplishment->overtime_id}");
                return;
            }
            //Approved overtime hours
            $hours = $accomplishment->duration_hours;

            // Date of overtime (already Carbon because of casts)
            $otDate = Carbon::parse($overtime->date_of_overtime);

            // Friday, Saturday, or Sunday
            $isWeekend = in_array($otDate->dayOfWeek, [
                Carbon::FRIDAY,
                Carbon::SATURDAY,
                Carbon::SUNDAY,
            ], true);

            // Check if holiday
            $isHoliday = Holiday::whereDate('holiday_date', $otDate)->exists();

            // Apply multiplier
            if ($isWeekend || $isHoliday) {
                $hours *= 1.5;
            }

            $employeeId = $overtime->employee_id;

            $daysToAdd = $hours * 0.125;

            $leaveCredit = LeaveCredit::firstOrCreate(
                [
                    'employee_id' => $employeeId,
                    'leave_type_id' => 10, // CTO leave type
                    'year' => now()->year,
                ],
                [
                    'balance' => 0,
                    'used' => 0,
                    'entitled' => 0,
                ]
            );

            $beforeBalance = $leaveCredit->balance;

            $leaveCredit->entitled += $daysToAdd;
            $leaveCredit->balance  += $daysToAdd;
            $leaveCredit->save();

            $otDate = Carbon::parse($overtime->date_of_overtime);

            LeaveCreditLog::create([
                'activity_id'    => $overtime->id,
                'employee_id'    => $overtime->employee_id,
                'leave_type_id'  => 10,

                'year'  => $otDate->year,
                'month' => $otDate->month,

                'earned'         => $daysToAdd,
                'credits'        => $daysToAdd,
                'action'         => 'grant',

                'before_balance' => $beforeBalance,
                'after_balance'  => $leaveCredit->balance,

                'remarks'        => "COC granted for Overtime Accomplishment Report of {$overtime->work_to_accomplished}",
            ]);

            Log::info("✅ Granted {$daysToAdd} COC hour(s) to Employee ID { $employeeId}");
        } catch (\Exception $e) {
            Log::error("❌ Error granting COC credits: " . $e->getMessage());
        }
    }

    public function showFile(string $filename)
    {
        $filename = urldecode($filename);

        if (!Storage::disk('network')->exists($filename)) {
            abort(404, 'File not found');
        }

        $mimeType = Storage::disk('network')->mimeType($filename);

        return response(
            Storage::disk('network')->get($filename),
            200
        )->header('Content-Type', $mimeType);
    }
}
