<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\IclockTransaction;
use App\Models\LeaveCredit;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use App\Models\Personnelemployeedevice;
use App\Models\PrivacyConcent;
use App\Models\Tko;
use Carbon\Carbon;


class DashboardController extends Controller
{
    public function index()
    {

        $employeeId = auth()->user()->employee_id;

        // ✅ get employee info (important)
        $employee = PersonnelEmployee::where('employee_id', $employeeId)->first();

        // get ALL leave types
        $leaveTypes = LeaveType::orderBy('name')->get();

        // get this employee's leave credits
        $credits = LeaveCredit::where('employee_id', $employeeId)->get()->keyBy('leave_type_id');

        // ✅ FILTER leave types based on employment status
        $filteredLeaveTypes = $leaveTypes->filter(function ($type) use ($employee) {

            if ($employee?->employment_status === 'Regular') {
                return true; // show all leave types
            }

            if (in_array($employee?->employment_status, ['Contractual', 'Job Order'])) {
                return in_array($type->id, [9, 10]); // 👈 adjust allowed IDs 
            }

            return false;
        });
        // combine
        $leaveCredits = $filteredLeaveTypes
            ->map(function ($type) use ($credits) {
                $credit = $credits->get($type->id);

                $entitled = $credit->entitled ?? 0;
                $used = $credit->used ?? 0;
                $balance = $credit->balance ?? 0;

                // Convert CTO days to hours
                if (in_array($type->id, [10])) {
                    $entitled *= 8;
                    $used *= 8;
                    $balance *= 8;
                }

                return [
                    'leave_type_id' => $type->id,
                    'leave_type_name' => $type->name,
                    'entitled' => $entitled,
                    'used' => $used,
                    'balance' => $balance,
                ];
            })
            ->filter(function ($item) {
                return $item['entitled'] > 0 && $item['balance'] > 0;
            })
            ->values();

        $emp_code = Personnelemployeedevice::where('employee_id', auth()->user()->employee_id)->first();
        $getEmpcode = $emp_code?->emp_code;
        $dtr = IclockTransaction::with('employee_transaction')
            ->where('emp_code',  $getEmpcode)
            ->whereDate('punch_time', Carbon::today())
            ->whereIn('punch_state', [0, 1]) // PUNCH IN only
            ->orderBy('punch_time', 'desc')
            ->limit(50) // latest 10 punch-ins
            ->get();

        $today = now()->format('m-d');

        $birthdays = PersonnelEmployee::whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') = ?", [$today])
            ->get();

        $anniversaries = PersonnelEmployee::whereRaw("DATE_FORMAT(date_hired, '%m-%d') = ?", [$today])
            ->get();

        $privacyAccepted = PrivacyConcent::where('user_id', auth()->id())
            ->where('version', '1.0')
            ->exists();

        $tkos = Tko::with(['approvals', 'employeeBy'])
            ->where('employee_id', auth()->user()->employee_id)
            ->whereHas('approvals', function ($q) {
                $q->whereIn('status', ['approved', 'auto-approved']);
            })
            ->select('employee_id')
            ->selectRaw('COUNT(*) as tko_count')
            ->groupBy('employee_id')
            ->get();

        return inertia('Dashboard/User', [
            'tkos' => $tkos,
            'privacyAccepted' => $privacyAccepted,
            'birthdayEmployees' => $birthdays,
            'anniverysaryEmployees' => $anniversaries,
            'leavecredits' => $leaveCredits,
            'dtrs' => $dtr
        ]);
    }
}
