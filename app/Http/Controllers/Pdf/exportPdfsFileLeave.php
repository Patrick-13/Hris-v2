<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\PersonnelLeave;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class exportPdfsFileLeave extends Controller
{
    public function exportpdfleave($id)
    {
        // ✅ Load employee + related job/salary
        $esignature = null;

        $leave = PersonnelLeave::with([
            'employeeBy.employeeJobBy',
            'employeeBy.employeeSalaryBy',
            'employeeBy.leavesBy',
            'employeeBy.leavecreditBy.leaveTypeBy',
            'employeeBy.esignature',
            'leaveUsedLog'
        ])->findOrFail($id);

        // dd($leave);

        // dd($leave);
        $employee = $leave->employeeBy; // ✅ correct relationship

        if ($employee?->esignature?->profileEsignature) {
            $path = Storage::disk('network')->path(
                $employee->esignature->profileEsignature
            );

            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $image = file_get_contents($path);

                $esignature = 'data:image/' . $type . ';base64,' . base64_encode($image);
            }
        }


        $leavetype = LeaveType::find($leave->leave_type_id);
        $leavename = $leavetype->name;

        $vacationLeaveCredit = $leave->leaveUsedLog
            ?->where('leave_type_id', 1)
            ->where('personnel_leave_id', $id)
            ->first();

        $sickLeaveCredit = $leave->leaveUsedLog
            ?->where('leave_type_id', 2)
            ->where('personnel_leave_id', $id)
            ->first();

        $data = [
            'department' => 'Environmental Management Bureau XI',
            'lastname' => $employee?->lastname ?? '',
            'firstname' => $employee?->firstname ?? '',
            'middlename' => $employee?->middlename ?? '',
            'position' => $employee?->employeeJobBy?->first()?->jobTitle ?? 'N/A',
            'salary' => $employee?->employeeSalaryBy?->first()?->amount ?? 'N/A',
            'date_of_filing' => $leave->created_at->format('F d, Y'),
            'leave_type' => $leavename ?? 'N/A',
            'details' => $leave->reason ?? '',
            'leavespent' => $leave->leavespent ?? '',
            'no_of_days' => $leave->total_days ?? '',
            'inclusive_dates' => $leave->start_date && $leave->end_date
                ? Carbon::parse($leave->start_date)->format('F d, Y') . ' to ' . Carbon::parse($leave->end_date)->format('F d, Y')
                : '',
            'request_status' => $employee?->leavesBy?->first()?->request_status ?? 'N/A',
            'vacation_leave' => $vacationLeaveCredit->entitled ?? '',
            'sick_leave' => $sickLeaveCredit->entitled ?? '',
            'used_vacation' => $vacationLeaveCredit->used ?? '',
            'used_sick' => $sickLeaveCredit->used ?? '',
            'balance_vacation' => $vacationLeaveCredit->balance ?? '',
            'balance_sick' => $sickLeaveCredit->balance ?? '',
            'certified_by' => $leave->certified_by ?? '',
            'recommending' => $leave->recommending ?? '',
            'approved_by' => $leave->approved_by ?? '',
            'esignature' => $esignature,
        ];

        // dd($data);

        $pdf = Pdf::loadView('pdf.application_for_leave', $data)
            ->setPaper('legal', 'portrait');

        return $pdf->download('Application_for_Leave_' . ($employee?->lastname ?? 'unknown') . '.pdf');
    }
}
