<?php

namespace App\Http\Controllers\User;

use App\DTOs\ActivityData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityStoreRequest;
use App\Http\Requests\ActivityUpdateRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\Activity;
use App\Models\ActivityType;
use App\Models\Division;
use App\Models\PersonnelEmployee;
use App\Models\Section;
use App\Services\ActivityService;

class ActivityController extends Controller
{
    protected ActivityService $activityService;

    public function __construct(ActivityService $activityService)
    {
        $this->activityService = $activityService;
    }

    public function index()
    {
        $query = Activity::with('employees');

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('soNumber', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            });
        }
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $activity = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $activity->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $employeeQuery = PersonnelEmployee::with('movement')->where('emp_status', 0);;

        if (request()->filled('search')) {
            $search = request('search');
            $employeeQuery->where(function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        // Filter employees by division
        if (request()->filled('division_id')) {
            $employeeQuery->whereHas('movement', function ($q) {
                $q->where('division_id', request('division_id'));
            });
        }

        // Filter employees by section
        if (request()->filled('section_id')) {
            $employeeQuery->whereHas('movement', function ($q) {
                $q->where('section_id', request('section_id'));
            });
        }

        // Filter employees by status
        if (request()->filled('status')) {
            $employeeQuery->where('employment_status', request('status'));
        }

        $employees = $employeeQuery->get();

        $totalCount = $activity->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $activity->count();
        $currentPage = $activity->currentPage();

        $activityypes = ActivityType::all();
        $divisions = Division::all();
        $sections = Section::all();


        return inertia("Admin/Activity/Index", [
            "activities" => ActivityResource::collection($activity),
            'activityemployees' => $employees,
            'divisions' => $divisions,
            'sections' => $sections,
            'activityypes' => $activityypes,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }


    public function store(ActivityStoreRequest $request)
    {
        $dto = ActivityData::fromArray($request->validated());

        $this->activityService->createActivity($dto);

        return redirect()->back()->with(['success' => 'Activity data Created successfully.']);
    }

    public function edit($id)
    {
        $activity = $this->activityService->getIdwithEmployees($id);

        return response()->json($activity);
    }

    public function show($id)
    {
        $activity = $this->activityService->getId($id);

        // Paginate employees related to this activity
        $employees = $activity->employees()->paginate(9);

        $totalCount = $employees->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $employees->count();
        $currentPage = $employees->currentPage();


        return response()->json([
            'activity' => new ActivityResource($activity),
            'employees' => PersonnelEmployeeResource::collection($employees),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
            'links' => [
                'first' => $employees->url(1),
                'last' => $employees->url($employees->lastPage()),
                'prev' => $employees->previousPageUrl(),
                'next' => $employees->nextPageUrl(),
            ],
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ActivityUpdateRequest $request, $id)
    {
        $dto = ActivityData::fromArray($request->validated());

        $this->activityService->updateActivity($dto, $id);

        return redirect()->back()->with(['success' => 'Activity data updated successfully.']);
    }

    public function attendancereport($id)
    {
        $showactivity = $this->activityService->getId($id); // or just find($id) if you don’t want it to 404

        return response()->json($showactivity);
    }
}
