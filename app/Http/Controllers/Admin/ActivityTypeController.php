<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ActivityTypeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityTypeStoreRequest;
use App\Http\Requests\ActivityTypeUpdateRequest;
use App\Http\Resources\ActivityTypeResource;
use App\Models\ActivityType;
use App\Services\ActivityTypeService;

class ActivityTypeController extends Controller
{
    protected ActivityTypeService $activityTypeService;

    public function __construct(ActivityTypeService $activityTypeService)
    {
        $this->activityTypeService = $activityTypeService;
    }

    public function index()
    {
        $query = ActivityType::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $activitytypes = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $activitytypes->total();
        // Get the count of positions being displayed on the current page
        $currentPageCount = $activitytypes->count();
        $currentPage = $activitytypes->currentPage();



        return inertia("Admin/ActivityType/Index", [
            "activitytypes" => ActivityTypeResource::collection($activitytypes),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(ActivityTypeStoreRequest $request)
    {
        $dto = ActivityTypeData::fromArray($request->validated());

        $this->activityTypeService->createActivityType($dto);

        return redirect()->route('activitytype.index')->with([
            'success' => 'Activity Type Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $activitytype = ActivityType::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($activitytype);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ActivityTypeUpdateRequest $request, $id)
    {
        $dto = ActivityTypeData::fromArray($request->validated());

        $this->activityTypeService->updateActivityType($dto, $id);


        return redirect()->route('activitytype.index')->with([
            'success' => 'Activity Type Data Updated Successfully!',
        ]);
    }
}
