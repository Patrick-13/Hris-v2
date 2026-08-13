<?php

namespace App\Http\Controllers\User;

use App\DTOs\OvertimeAccomplishmentData;
use App\DTOs\PersonnelOvertimeData;
use App\DTOs\PersonnelOvertimeDataUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\OvertimeAccomplishmentStoreRequest;
use App\Http\Requests\PersonnelOvertimeStoreRequest;
use App\Http\Requests\PersonnelOvertimeUpdateRequest;
use App\Http\Resources\PersonnelOvertimeResource;
use App\Models\Personnelovertime;
use App\Services\EmployeeOvertimeService;
use App\Services\OvertimeAccomplishmentService;

class MyOvertimeConroller extends Controller
{

    protected EmployeeOvertimeService $employeeOvertimeService;
    protected OvertimeAccomplishmentService $overtimeAccomplishmentService;

    public function __construct(EmployeeOvertimeService $employeeOvertimeService, OvertimeAccomplishmentService $overtimeAccomplishmentService)
    {
        $this->employeeOvertimeService = $employeeOvertimeService;
        $this->overtimeAccomplishmentService = $overtimeAccomplishmentService;
    }

    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user


        $query = Personnelovertime::with(['employeeBy', 'approvals.approver']);

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->orWhereHas('employeeBy', function ($sub) use ($search) {
                    $sub->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            });
        }

        if ($user->role !== 'admin') {
            $query->where('employee_id', $user->employee_id);
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $personnelovertime = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        $personnelovertime->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $personnelovertime->total();
        $currentPageCount = $personnelovertime->count();
        $currentPage = $personnelovertime->currentPage();


        return inertia("User/MyOvertime/Index", [
            "personnelovertimes" => PersonnelOvertimeResource::collection($personnelovertime),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(PersonnelOvertimeStoreRequest $request)
    {
        $dto = PersonnelOvertimeData::fromArray($request->validated());

        try {
            $this->employeeOvertimeService->createOvertime($dto);

            return redirect()->route('myovertime.index')->with([
                'success' => 'Employee Authority to Render Overtime Created Successfully!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }

    public function accomplishment(OvertimeAccomplishmentStoreRequest $request, $overtimeId)
    {

        $validated = $request->validated();

        foreach ($validated['accomplishments'] as $item) {
            $dto = OvertimeAccomplishmentData::fromArray($item, $overtimeId);
            $this->overtimeAccomplishmentService->createOTAccomplishment($dto);
        }
        return redirect()->route('myovertime.index')->with([
            'success' => 'Employee Render Accomplishment Overtime Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $employeeleave = $this->employeeOvertimeService->getId($id);

        return response()->json($employeeleave);
    }

    public function update(PersonnelOvertimeUpdateRequest $request, $id)
    {
        $dto = PersonnelOvertimeDataUpdate::fromArray($request->validated());

        $this->employeeOvertimeService->updateOvertime($dto, $id);


        return redirect()->route('myovertime.index')->with([
            'success' => 'Employee Overtime Updated Successfully!',
        ]);
    }

    public function show($id)
    {
        $employeeovertime = Personnelovertime::findOrFail($id);
        // or just find($id) if you don’t want it to 404

        return response()->json($employeeovertime);
    }


    public function showaccomplishment($id)
    {
        $employeeovertime = Personnelovertime::with([
            'accomplishments.approvals',
            'accomplishments.overtime',
            'approvals',
            'employeeBy',
        ])->where('id', $id)->get();


        return PersonnelOvertimeResource::collection($employeeovertime);
    }

    public function attachment($id)
    {
        $employeeovertime = Personnelovertime::where('id', $id)->get();

        return PersonnelOvertimeResource::collection($employeeovertime);
    }
}
