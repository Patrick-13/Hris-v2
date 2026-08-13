<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonnelLeaveResource;
use App\Models\Activity;
use App\Models\LeaveType;
use App\Models\PersonnelLeave;
use App\Services\EmployeeLeaveService;
use Illuminate\Support\Facades\Auth;

class EmployeeLeaveController extends Controller
{
    protected EmployeeLeaveService $employeeLeaveService;

    public function __construct(EmployeeLeaveService $employeeLeaveService)
    {
        $this->employeeLeaveService = $employeeLeaveService;
    }

    public function index()
    {
        $user = auth()->user();


        $query = PersonnelLeave::with(['employeeBy', 'leaveType']);

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->orWhereHas('employeeBy', function ($sub) use ($search) {
                    $sub->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                })->orWhereHas('leaveType', function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%");
                });
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");



        // ✅ If the logged-in user is not admin, filter by their employee_id
        if ($user->role !== 'admin') {
            $query->whereHas('approvals', function ($subQuery) use ($user) {
                $subQuery->where('approver_id', $user->employee_id);
            })
                ->where('employee_id', '!=', $user->employee_id); // ← exclude own leave
        }

        $personneleave = $query
            ->with(['employeeBy', 'leaveType', 'approvals.approver']) // ✅ eager load relations
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $personneleave->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $personneleave->total();
        $currentPageCount = $personneleave->count();
        $currentPage = $personneleave->currentPage();

        $leavetypes = LeaveType::all();

        $employeeId = Auth::user()->employee_id;

        $activitytypes = Activity::with('activityTypeBy')
            ->whereHas('employees', function ($query) use ($employeeId) {
                $query->where('activity_employees.employee_id', $employeeId);
            })
            ->whereDoesntHave('personnelLeaves', function ($query) use ($employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->get();

        return inertia("Admin/PersonelLeave/Index", [
            "personneleaves" => PersonnelLeaveResource::collection($personneleave),
            'leavetypes' => $leavetypes,
            'activitytypes' => $activitytypes,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
}
