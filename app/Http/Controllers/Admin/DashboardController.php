<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelLeaveResource;
use App\Models\Dtr;
use App\Models\IclockTransaction;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use App\Models\PrivacyConcent;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->format('Y-m-d');
        //employee count
        $employeecount = PersonnelEmployee::count();

        //leave count
        $employeesOnLeave = PersonnelLeave::whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->where('request_status', 'approved')
            ->pluck('employee_id');

        $employeesOnLeaveToday = PersonnelLeave::with(['employeeBy', 'leaveType'])->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->where('request_status', 'approved')
            ->get();

        //dtr today
        $dtrToday = Dtr::whereDate('punch_date', $today)->get();

        //present count
        $presentCount = $dtrToday->count();

        //leave count
        $leavecount = $employeesOnLeave->count();

        //late count
        $lateCount = $dtrToday->filter(function ($row) {
            $timeIn = Carbon::parse($row->timeIn);
            return $timeIn->gt(Carbon::parse('08:00'));
        })->count();

        //present employees
        $presentEmployeeIds = $dtrToday->pluck('employee_id');

        //absent count
        $absentCount = PersonnelEmployee::whereNotIn('employee_id', $presentEmployeeIds)
            ->whereNotIn('employee_id', $employeesOnLeave)
            ->count();

        $year = Carbon::now()->year;

        $monthlyAttendance = collect(range(1, 12))->map(function ($month) use ($year) {
            $start = Carbon::create($year, $month, 1)->startOfMonth();
            $end   = Carbon::create($year, $month, 1)->endOfMonth();

            // DTRs in the month
            $dtrs = Dtr::whereBetween('punch_date', [$start, $end])->get();

            // Late
            $late = $dtrs->filter(function ($row) {
                return Carbon::parse($row->timeIn)->gt(Carbon::parse('08:00'));
            })->count();

            // Leave
            $leaveEmployees = PersonnelLeave::whereDate('start_date', '<=', $end)
                ->whereDate('end_date', '>=', $start)
                ->whereHas('approvals', function ($q) {
                    $q->whereIn(DB::raw('LOWER(level)'), ['regional', 'hr'])
                        ->whereRaw('LOWER(status) = ?', ['approved']);
                })
                ->distinct('employee_id')
                ->count('employee_id');

            // Present employees
            $presentEmployeeIds = $dtrs->pluck('employee_id')->unique();

            // Absent
            $absent = PersonnelEmployee::whereNotIn('employee_id', $presentEmployeeIds)
                ->count();

            return [
                'month'  => Carbon::create()->month($month)->format('M'),
                'late'   => $late,
                'leave'  => $leaveEmployees,
                'absent' => $absent,
            ];
        });

        $male = PersonnelEmployee::where('gender', 'Male')->count();
        $female = PersonnelEmployee::where('gender', 'Female')->count();

        $month = request('month') ?? Carbon::now()->month;
        $birthday = PersonnelEmployee::whereMonth('date_of_birth', $month)
            ->orderByRaw('DAY(date_of_birth) ASC')
            ->get();
        $dtr = IclockTransaction::with('employee_transaction')
            ->whereDate('punch_time', Carbon::today())
            ->whereIn('punch_state', [0, 1]) // PUNCH IN only
            ->orderBy('punch_time', 'desc')
            ->limit(50) // latest 10 punch-ins
            ->get();

        return inertia('Admin/Dashboard/Admin', [
            'employeecount' => $employeecount,
            'employeesOnLeaveToday' => $employeesOnLeaveToday,
            'leavecount'    => $leavecount,
            'present'       => $presentCount,
            'late'          => $lateCount,
            'absent'        => $absentCount,
            'male'              => $male,
            'female'            => $female,
            'attendanceTrend'    => $monthlyAttendance,
            'birthday'            => $birthday,
            'selectedMonth' => $month,
            'dtr' => $dtr
        ]);
    }
}
