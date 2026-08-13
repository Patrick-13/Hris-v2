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
use App\Models\PersonnelEmployee;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MyActivityController extends Controller
{

    protected ActivityService $activityService;

    public function __construct(ActivityService $activityService)
    {
        $this->activityService = $activityService;
    }
    public function index()
    {
        $userEmpId = Auth::user()->employee_id;
        $query = Activity::with('employees') // Eager load the employees relationship
            ->whereHas('employees', function ($q) use ($userEmpId) {
                // Ensure the employee is linked to the activity via the ActivityEmployees pivot table
                $q->where('activity_employees.employee_id', $userEmpId);
            });

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

        $totalCount = $activity->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $activity->count();
        $currentPage = $activity->currentPage();

        $employees = PersonnelEmployee::all();
        $activityypes = ActivityType::all();


        return inertia("User/Activity/Index", [
            "activities" => ActivityResource::collection($activity),
            'employees' => $employees,
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

    public function show($id)
    {
        $activity = Activity::findOrFail($id);

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
}
