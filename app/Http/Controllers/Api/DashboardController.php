<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dtr;
use App\Models\IclockTransaction;
use App\Models\LeaveCredit;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use App\Models\Personnelemployeedevice;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {

        $employeeId = auth()->user()->employee_id;

        $today = now()->format('m-d');
        $dateFrom = request('date_from');
        $dateTo = request('date_to');


        // ✅ get employee info (important)
        $employee = PersonnelEmployee::where('employee_id', $employeeId)->first();

        // get ALL leave types
        $leaveTypes = LeaveType::orderBy('name')->get();

        // get this employee's leave credits
        $credits = LeaveCredit::where('employee_id', $employeeId)->get()->keyBy('leave_type_id');

        // ✅ FILTER leave types based on employment status
        $filteredLeaveTypes = $leaveTypes->filter(function ($type) use ($employee) {

            if ($employee->employment_status === 'Regular') {
                return true; // show all leave types
            }

            if (in_array($employee->employment_status, ['Contractual', 'Job Order'])) {
                return in_array($type->id, [9]); // 👈 adjust allowed IDs 
            }

            return false;
        });
        // combine
        $leaveCredits = $filteredLeaveTypes
            ->map(function ($type) use ($credits) {
                $credit = $credits->get($type->id);

                return [
                    'leave_type_id' => $type->id,
                    'leave_type_name' => $type->name,
                    'entitled' => $credit->entitled ?? 0,
                    'used' => $credit->used ?? 0,
                    'balance' => $credit->balance ?? 0,
                ];
            })
            ->filter(function ($item) {
                return $item['entitled'] > 0 && $item['balance'] > 0;
            })
            ->values();
        $emp_code = Personnelemployeedevice::where('employee_id', auth()->user()->employee_id)->first();
        $getEmpcode = $emp_code->emp_code;
        $dtr = IclockTransaction::with('employee_transaction')
            ->where('emp_code',  $getEmpcode)
            ->whereDate('punch_time', Carbon::today())
            ->whereIn('punch_state', [0, 1]) // PUNCH IN only
            ->orderBy('punch_time', 'desc')
            ->limit(50) // latest 10 punch-ins
            ->get();


        $query = Dtr::with('employeeTransaction') // correct relationship
            ->whereHas('employeeTransaction', function ($q) use ($employeeId) {
                $q->where('employee_id', $employeeId);
            });

        if ($dateFrom && $dateTo) {
            $query->whereDate('punch_date', '>=', $dateFrom)
                ->whereDate('punch_date', '<=', $dateTo);
        }
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $mydtr = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);


        $birthdays = PersonnelEmployee::whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') = ?", [$today])
            ->get();

        $anniversaries = PersonnelEmployee::whereRaw("DATE_FORMAT(date_hired, '%m-%d') = ?", [$today])
            ->get();

        return response()->json([
            'birthdays' => $birthdays,
            'anniversaries' => $anniversaries,
            'leaveCredits' => $leaveCredits,
            'dtr' => $dtr,
            'mydtr' => $mydtr
        ]);
    }
}
