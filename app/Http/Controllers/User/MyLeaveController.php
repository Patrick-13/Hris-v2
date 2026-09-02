<?php

namespace App\Http\Controllers\User;

use App\DTOs\PersonnelLeaveData;
use App\Http\Controllers\Controller;
use App\Http\Requests\PersonnelLeaveStoreRequest;
use App\Http\Requests\PersonnelLeaveUpdateRequest;
use App\Http\Resources\PersonnelLeaveResource;
use App\Models\Activity;
use App\Models\Coc_credit;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use App\Services\EmployeeLeaveService;
use Illuminate\Support\Facades\Auth;

class MyLeaveController extends Controller
{
    protected EmployeeLeaveService $employeeLeaveService;

    public function __construct(EmployeeLeaveService $employeeLeaveService)
    {
        $this->employeeLeaveService = $employeeLeaveService;
    }

    public function index()
    {
        $user = auth()->user();

        $query = PersonnelLeave::with(['employeeBy', 'leaveType', 'approvals.approver', 'refunds']);

        $query->where('employee_id', $user->employee_id);

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

        $personneleave = $query
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
        $employee = PersonnelEmployee::where('employee_id', $employeeId)->first();
        $ctoLeave = Coc_credit::where('employee_id', $employeeId)
            ->whereDate('expiration_date', '>=', now())
            ->get();


        return inertia("User/MyLeave/Index", [
            "personneleaves" => PersonnelLeaveResource::collection($personneleave),
            'leavetypes' => $leavetypes,
            'ctoLeave' => $ctoLeave,
            'activitytypes' => $activitytypes,
            'employmentStatus' => $employee->employment_status,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(PersonnelLeaveStoreRequest $request)
    {
        $dto = PersonnelLeaveData::fromArray($request->validated());

        try {
            $this->employeeLeaveService->createLeave($dto);

            return redirect()->route('myleave.index')->with([
                'success' => 'Employee Leave Created Successfully!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }


    public function edit($id)
    {
        $employeeleave = PersonnelLeave::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($employeeleave);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PersonnelLeaveUpdateRequest $request, $id)
    {
        $remarks = $request->input('remarks');

        $dto = PersonnelLeaveData::fromArray($request->validated());

        $this->employeeLeaveService->updateLeave($dto, $id, $remarks);


        return redirect()->route('myleave.index')->with([
            'success' => 'Employee Leave Updated Successfully!',
        ]);
    }
}
