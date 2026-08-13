<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\LeaveCredit;
use App\Models\PersonnelLeave;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class exportCTOLeave extends Controller
{
    public function exportpdfctoleave($id)
    {
        // ✅ Get logged-in employee ID
        $employeeId = Auth::user()->employee_id;

        $leave = PersonnelLeave::with(['employeeBy'])
            ->findOrFail($id);

        if ((int)$leave->leave_type_id !== 10) {
            return redirect()->back()->with('error', 'Not a CTO leave record.');
        }

        // ✅ Employee name
        $employee = $leave->employeeBy;

        $employee_name = $employee
            ? "{$employee->firstname} " .
            ($employee->middlename ? substr($employee->middlename, 0, 1) . '. ' : '') .
            "{$employee->lastname}"
            : 'N/A';

        $hours = match ($leave->leave_mode) {
            'half'  => 5,
            'whole' => 10,
            default => (float) ($leave->total_days ?? 0) * 10,
        };


        $leaveCredit = LeaveCredit::where('employee_id', $employeeId)
            ->where('leave_type_id', 10)
            ->first();

        $used = $leaveCredit->used ?? 0;
        $balance = $leaveCredit->balance ?? 0;
        // ✅ Format the relevant dates

        $date_issued = Carbon::now()->format('F d, Y');
        $valid_until = Carbon::now()->addYear()->format('F d, Y');

        $earned_date = Carbon::parse($leave->start_date)->format('F d, Y');

        // ✅ Optional reference or control numbers
        $reference_no = 'Ref. No. CTO-' . $leave->id;
        $control_no = 'Control No. ' . strtoupper(substr(md5($leave->id . $employee_name), 0, 8));

        // ✅ Pass all the data to Blade
        $data = [
            'employee_name' => $employee_name,
            'hours' => $hours,
            'used' => $used,
            'balance' => $balance,
            'earned_date' => $earned_date,
            'date_issued' => $date_issued,
            'valid_until' => $valid_until,
            'reference_no' => $reference_no,
            'control_no' => $control_no,
        ];

        // ✅ Generate the PDF
        $pdf = Pdf::loadView('pdf.application_cto_leave', $data)
            ->setPaper('letter', 'portrait');

        // ✅ Download the PDF file
        return $pdf->download('Certificate_of_COC_' . ($employee?->lastname ?? 'unknown') . '.pdf');
    }
}
