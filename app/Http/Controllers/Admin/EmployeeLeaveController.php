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
        $user = auth()->user(); // ✅ Get logged-in user


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

        $pendingQuery = clone $query;
        $approvedQuery = clone $query;
        $waitingQuery = clone $query;
        $rejectedQuery = clone $query;

        //pending query
        $personneleave = $pendingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'Pending');
            })
            ->with([
                'employeeBy',
                'leaveType',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'pending_page'
            )
            ->onEachSide(1);

        $personneleave->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'pending_page', // preserve the other paginator
            ])
        );

        $totalCount = $personneleave->total();
        $currentPageCount = $personneleave->count();
        $currentPage = $personneleave->currentPage();

        //waiting query
        $personneleavewaiting = $waitingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'Waiting');
            })
            ->with([
                'employeeBy',
                'leaveType',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'waiting_page'
            )
            ->onEachSide(1);

        $personneleavewaiting->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'waiting_page', // preserve the other paginator
            ])
        );

        $totalCountwaiting = $personneleavewaiting->total();
        $currentPageCountwaiting = $personneleavewaiting->count();
        $currentPagewaiting = $personneleavewaiting->currentPage();

        //approved query
        $personneleaveapproved = $approvedQuery
            ->where('request_status', 'approved')
            ->with([
                'employeeBy',
                'leaveType',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'approved_page'
            )
            ->onEachSide(1);

        $personneleaveapproved->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'approved_page', // preserve the other paginator
            ])
        );

        $totalCountapproved = $personneleaveapproved->total();
        $currentPageCountapproved = $personneleaveapproved->count();
        $currentPageapproved = $personneleaveapproved->currentPage();

        //rejected query
        $personneleaverejected = $rejectedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'rejected');
            })
            ->with([
                'employeeBy',
                'leaveType',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'rejected_page'
            )
            ->onEachSide(1);

        $personneleaverejected->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'rejected_page', // preserve the other paginator
            ])
        );

        $totalCountrejected = $personneleaverejected->total();
        $currentPageCountrejected = $personneleaverejected->count();
        $currentPagerejected = $personneleaverejected->currentPage();

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
            "personneleaveapproved" => PersonnelLeaveResource::collection($personneleaveapproved),
            "personneleavewaiting" => PersonnelLeaveResource::collection($personneleavewaiting),
            "personneleaverejected" => PersonnelLeaveResource::collection($personneleaverejected),
            'leavetypes' => $leavetypes,
            'activitytypes' => $activitytypes,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
            'totalCountwaiting' => $totalCountwaiting,
            'currentPageCountwaiting' => $currentPageCountwaiting,
            'currentPagewaiting' => $currentPagewaiting,
            'totalCountapproved' => $totalCountapproved,
            'currentPageCountapproved' => $currentPageCountapproved,
            'currentPageapproved' => $currentPageapproved,
            'totalCountrejected' => $totalCountrejected,
            'currentPageCountrejected' => $currentPageCountrejected,
            'currentPagerejected' => $currentPagerejected,
        ]);
    }
}
