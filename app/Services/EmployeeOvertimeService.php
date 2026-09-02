<?php

namespace App\Services;

use App\DTOs\OvertimeApprovalData;
use App\DTOs\PersonnelOvertimeData;
use App\DTOs\PersonnelOvertimeDataUpdate;
use App\Models\Coc_credit;
use App\Models\Division;
use App\Models\EmployeeMovement;
use App\Models\OvertimeApproval;
use App\Models\OvertimeApprovalHistory;
use App\Models\Personnelovertime;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EmployeeOvertimeService
{
    public function createOvertime(PersonnelOvertimeData $data): Personnelovertime
    {
        $lastOvertime = null;
        $path = null;

        if ($data->attachment_file) {
            $file = $data->attachment_file;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "raro_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs("raro/{$folder}", $filename, 'network');
        }


        foreach ($data->worktoaccomplishments as $work) {
            $lastOvertime = Personnelovertime::create([
                'date_of_request'      => $data->date_of_request,
                'purpose_of_overtime'  => $data->purpose_of_overtime,
                'justification'        => $data->justification,
                'attachment_file'      => $path ? $path : null,
                'employee_id'          => $data->employee_id,
                'work_to_accomplished' => $work['work_to_accomplished'],
                'duration_hours'       => $work['duration_hours'],
                'date_of_overtime'     => $work['date_of_overtime'],
                'request_status'       => $data->request_status,
            ]);

            $this->createApprovalsForOvertime($lastOvertime);
        }

        return $lastOvertime;
    }


    public function getId(int $id): Personnelovertime
    {
        return Personnelovertime::findOrFail($id);
    }


    public function updateOvertime(PersonnelOvertimeDataUpdate $data, int $id): Personnelovertime
    {
        $overtime = Personnelovertime::findOrFail($id);

        $updateData  = [
            'date_of_request'      => $data->date_of_request,
            'purpose_of_overtime'  => $data->purpose_of_overtime,
            'justification'        => $data->justification,
            'employee_id'          => $data->employee_id,
            'work_to_accomplished' => $data->work_to_accomplished,
            'duration_hours'       => $data->duration_hours,
            'date_of_overtime'     => $data->date_of_overtime,
            'request_status'       => $data->request_status,
        ];

        // Only update attachment if a NEW file was uploaded
        if ($data->attachment_file) {
            $file = $data->attachment_file;

            $folder = preg_replace(
                '/[^A-Za-z0-9_\-]/',
                '_',
                'raro_attachments'
            );

            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs(
                "raro/{$folder}",
                $filename,
                'network'
            );

            $updateData['attachment_file'] = $path;
        }

        $overtime->update($updateData);


        $approvals = OvertimeApproval::where(
            'overtime_id',
            $overtime->id
        )
            ->orderBy('level')
            ->get();

        foreach ($approvals as $index => $approval) {

            $approval->update([
                'status' => $index === 0
                    ? 'pending'
                    : 'waiting',

                'remarks' => null,
                'approved_at' => null,
            ]);
        }

        return $overtime;
    }



    private function createApprovalsForOvertime(Personnelovertime $overtime): void
    {
        $movement = EmployeeMovement::where('employee_id', $overtime->employee_id)
            ->latest()
            ->first();

        if (!$movement) return;

        $employeeId = $overtime->employee_id;

        // Check if the employee belongs to the ORD division.
        // ORD employees skip Division Chief approval.
        $isORD = $movement->divisionBy && stripos($movement->divisionBy->div_name, 'ORD') !== false;

        // Get approvers
        $sectionChief = $movement->sectionBy?->employeeBy?->employee_id;
        $divisionChief = $movement->divisionBy?->employeeBy?->employee_id;
        $regionalDirector = Division::where('div_name', 'ORD')->first()?->employeeBy?->employee_id;

        // True when the Section Chief and Division Chief are the same person.
        // In this case, only one approval is needed before the Regional Director.
        $isSameApprover = $sectionChief && $divisionChief && $sectionChief === $divisionChief;

        // If the applicant is the Division Chief,
        // send the request directly to the Regional Director.
        if ($employeeId === $divisionChief && $regionalDirector) {
            $approval = $this->storeApproval(new OvertimeApprovalData($overtime->id, $regionalDirector, 'rd'));

            $approval->update([
                'status' => 'pending',
                'pending_at' => now(),
            ]);
            return;
        }

        $approvers = [];


        // Add Section Chief approval unless:
        // - the applicant is the Section Chief, or
        // - the Section Chief and Division Chief are the same person
        //   (to avoid duplicate approvals).
        if ($employeeId !== $sectionChief && $sectionChief && !$isSameApprover) {
            $approvers[] = [
                'id' =>  $sectionChief,
                'type' => 'section/unit'
            ];
        }

        // Add Division Chief approval unless the employee belongs to ORD.
        // If the Section Chief and Division Chief are the same person,
        // this serves as their single approval.
        if (!$isORD && $divisionChief) {
            $approvers[] = [
                'id' => $divisionChief,
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

            $approval = $this->storeApproval(new OvertimeApprovalData(
                $overtime->id,
                $approver['id'],
                $approver['type']
            ));

            // FIRST = ACTIVE
            if ($index === 0) {
                $approval->update([
                    'status' => 'pending',
                ]);
            } else {
                $approval->update([
                    'status' => 'waiting',
                ]);
            }
        }
    }



    public function storeApproval(OvertimeApprovalData $data): OvertimeApproval
    {
        return OvertimeApproval::create([
            'overtime_id'    => $data->overtime_id,
            'approver_id' => $data->approver_id,
            'level'       => $data->level,
            'status'      => $data->status,
            'approved_at' => $data->approved_at,
        ]);
    }

    public function approveOvertime($overtimeId, $status, $remarks)
    {
        $approverId = Auth::user()->employee_id;

        $approval = OvertimeApproval::where('overtime_id', $overtimeId)
            ->where('approver_id', $approverId)
            ->where('status', 'pending')
            ->firstOrFail();

        $overtime = $approval->overtime;

        /*
     * ============================================================
     * REJECTED
     * ============================================================
     *
     * Rejection stops the entire approval process.
     */
        if ($status === 'rejected') {

            $approval->update([
                'status' => 'rejected',
                'remarks' => $remarks,
                'approved_at' => now(),
            ]);

            // Cancel all remaining approvals
            OvertimeApproval::where('overtime_id', $overtimeId)
                ->where('status', 'waiting')
                ->update([
                    'status' => 'cancelled',
                ]);

            $overtime->update([
                'status' => 'rejected',
            ]);

            return $approval;
        }

        /*
     * ============================================================
     * RETURNED
     * ============================================================
     *
     * Return moves the workflow BACK one level.
     *
     * Section  -> Employee
     * Division -> Section
     * RD       -> Division (non-ORD)
     * RD       -> Section  (ORD)
     */
        if ($status === 'returned') {
            /*
         * Record the return history BEFORE changing
         * the current approval status.
         */

            OvertimeApprovalHistory::create([
                'overtime_id' => $overtimeId,
                'approver_id' => $approverId,
                'level' => $approval->level,
                'remarks' => $remarks,
            ]);

            // Current approver becomes returned
            $approval->update([
                'status' => 'returned',
                'remarks' => $remarks,
                'approved_at' => null,
            ]);

            /*
         * --------------------------------------------------------
         * SECTION RETURNS
         * --------------------------------------------------------
         *
         * Section is the first approver, so the overtime goes
         * back to the employee for editing.
         */
            if ($approval->level === 'section/unit') {

                $overtime->update([
                    'status' => 'returned',
                ]);

                return $approval;
            }

            /*
         * --------------------------------------------------------
         * DIVISION RETURNS
         * --------------------------------------------------------
         *
         * Section becomes pending again.
         *
         * RD remains waiting.
         */
            if ($approval->level === 'division') {

                OvertimeApproval::where('overtime_id', $overtimeId)
                    ->where('level', 'section/unit')
                    ->update([
                        'status' => 'pending',
                        'remarks' => null,
                        'approved_at' => null,
                    ]);

                $overtime->update([
                    'status' => 'pending',
                ]);

                return $approval;
            }

            /*
         * --------------------------------------------------------
         * RD RETURNS
         * --------------------------------------------------------
         *
         * ORD:
         *     RD -> Section
         *
         * Non-ORD:
         *     RD -> Division
         */
            if ($approval->level === 'rd') {

                $movement = EmployeeMovement::where(
                    'employee_id',
                    $overtime->employee_id
                )
                    ->latest()
                    ->first();

                $isORD = $movement?->divisionBy
                    && stripos(
                        $movement->divisionBy->div_name,
                        'ORD'
                    ) !== false;

                $returnType = $isORD
                    ? 'section/unit'
                    : 'division';

                OvertimeApproval::where('overtime_id', $overtimeId)
                    ->where('level', $returnType)
                    ->update([
                        'status' => 'pending',
                        'remarks' => null,
                        'approved_at' => null,
                    ]);

                $overtime->update([
                    'status' => 'pending',
                ]);

                return $approval;
            }
        }

        /*
     * ============================================================
     * APPROVED
     * ============================================================
     */
        if ($status === 'approved') {

            $approval->update([
                'status' => 'approved',
                'remarks' => $remarks,
                'approved_at' => now(),
            ]);

            // Find next waiting approver
            $next = OvertimeApproval::where('overtime_id', $overtimeId)
                ->where('status', 'waiting')
                ->orderBy('level')
                ->first();

            if ($next) {

                Log::info('Activating next approver', [
                    'overtime_id' => $overtimeId,
                    'next_approver' => $next->approver_id,
                ]);

                $next->update([
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            } else {

                Log::info('No waiting approver found', [
                    'overtime_id' => $overtimeId,
                ]);

                // No more approvers = fully approved
                $overtime->update([
                    'status' => 'approved',
                ]);
            }

            return $approval;
        }

        return $approval;
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
