<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaveCreditLogsResource;
use App\Http\Resources\LeaveCreditResource;
use App\Models\LeaveCredit;
use App\Models\LeaveCreditLog;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use Illuminate\Http\Request;

class MyLeaveCreditController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        /*
    |--------------------------------------------------------------------------
    | Leave Credit Query
    |--------------------------------------------------------------------------
    */
        $creditQuery = LeaveCredit::with(['employeeBy', 'leaveTypeBy']);

        if (request()->filled('search')) {
            $search = request('search');

            $creditQuery->where(function ($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhere('leave_type_id', 'like', "%{$search}%")
                    ->orWhereHas('employeeBy', function ($sub) use ($search) {
                        $sub->where('lastname', 'like', "%{$search}%")
                            ->orWhere('firstname', 'like', "%{$search}%")
                            ->orWhere('employee_id', 'like', "%{$search}%");
                    });
            });
        }

        /*
    |--------------------------------------------------------------------------
    | Leave Credit Logs Query
    |--------------------------------------------------------------------------
    */
        $logQuery = LeaveCreditLog::with(['employee', 'leaveType']);

        if (request()->filled('search')) {
            $search = request('search');

            $logQuery->where(function ($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                    ->orWhere('month', 'like', "%{$search}%")
                    ->orWhere('earned', 'like', "%{$search}%")
                    ->orWhereHas('employee', function ($sub) use ($search) {
                        $sub->where('lastname', 'like', "%{$search}%")
                            ->orWhere('firstname', 'like', "%{$search}%")
                            ->orWhere('employee_id', 'like', "%{$search}%");
                    })
                    ->orWhereHas('leaveType', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%{$search}%");
                    });
            });
        }

        /*
    |--------------------------------------------------------------------------
    | Restrict non-admin users
    |--------------------------------------------------------------------------
    */
        if ($user->role !== 'admin') {
            $creditQuery->where('employee_id', $user->employee_id);
            $logQuery->where('employee_id', $user->employee_id);
        }

        /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
        $leavecredits = $creditQuery
            ->orderBy($sortField, $sortDirection)
            ->paginate(10, ['*'], 'credits_page')
            ->onEachSide(1);

        $leavecreditlogs = $logQuery
            ->latest()
            ->paginate(10, ['*'], 'logs_page')
            ->onEachSide(1);

        /*
    |--------------------------------------------------------------------------
    | Other data
    |--------------------------------------------------------------------------
    */
        $employees = PersonnelEmployee::all();
        $leavetypes = LeaveType::all();

        return inertia("User/LeaveCredit/Index", [
            "leavecredits" => LeaveCreditResource::collection($leavecredits),

            // or use a Resource if you have one
            "leavecreditlogs" => LeaveCreditLogsResource::collection($leavecreditlogs),

            "employees" => $employees,
            "leavetypes" => $leavetypes,

            "queryParams" => request()->query() ?: null,
            "success" => session('success'),

            "totalCount" => $leavecredits->total(),
            "currentPageCount" => $leavecredits->count(),
            "currentPage" => $leavecredits->currentPage(),

            // Optional if you want pagination info for Logs
            "logsTotalCount" => $leavecreditlogs->total(),
            "logsCurrentPageCount" => $leavecreditlogs->count(),
            "logsCurrentPage" => $leavecreditlogs->currentPage(),
        ]);
    }
}
