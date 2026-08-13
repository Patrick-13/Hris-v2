<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\LeaveCredit;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class exportCTOLeave extends Controller
{
    public function exportpdfctoleave($id)
    {
        // ✅ Get logged-in employee ID
        $employeeId = Auth::user()->employee_id;
        // ✅ Load the activity with employees
        $activity = Activity::with(['activityTypeBy', 'employees', 'personnelLeaves'])->findOrFail($id);

        $employee = $activity->employees->where('employee_id', $employeeId)->first();

        if (!$employee) {
            return redirect()->back()->with('error', 'You are not part of this activity.');
        }

        // ✅ Basic employee info
        $employee_name = $employee
            ? "{$employee->firstname} " . ($employee->middlename ? substr($employee->middlename, 0, 1) . '. ' : '') . "{$employee->lastname}"
            : 'N/A';

        // ✅ Calculate the number of hours (COC earned)
        $hours = $activity->noofHours ?? 0;

        // ✅ Fetch the leave credit for the employee (CTO leave)
        $leaveCredit = LeaveCredit::where('employee_id', $employeeId)
            ->where('leave_type_id', 3) // Assuming '1' is the CTO leave type ID
            ->first();


        // dd($leaveCredit);

        // ✅ If leave credit exists, get the used and balance hours
        if ($leaveCredit) {
            $used = $leaveCredit->used ?? 0;
            $balance = $leaveCredit->balance ?? 0;
        } else {
            // If no leave credit is found for the employee, assume 0 used and 0 balance
            $used = 0;
            $balance = 0;
        }

        // ✅ Format the relevant dates
        $earned_date = Carbon::parse($activity->dateTo)->format('F d, Y');
        $date_issued = Carbon::now()->format('F d, Y');
        $valid_until = Carbon::now()->addYear()->format('F d, Y');

        // ✅ Optional reference or control numbers
        $reference_no = 'Ref. No. ' . strtoupper($activity->soNumber ?? 'N/A');
        $control_no = 'Control No. ' . strtoupper(substr(md5($activity->id . $employee_name), 0, 8));

        // ✅ Pass all the data to Blade
        $data = [
            'employee_name' => $employee_name,
            'hours' => $hours,
            'used' => $used,
            'balance' => $balance,
            'earned_date' => $earned_date,
            'reference_no' => $reference_no,
            'date_issued' => $date_issued,
            'valid_until' => $valid_until,
            'control_no' => $control_no,
        ];

        // ✅ Generate the PDF
        $pdf = Pdf::loadView('pdf.application_cto_leave', $data)
            ->setPaper('legal', 'portrait');

        // ✅ Download the PDF file
        return $pdf->download('Certificate_of_COC_' . ($employee?->lastname ?? 'unknown') . '.pdf');
    }
}
