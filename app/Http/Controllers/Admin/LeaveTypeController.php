<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\LeaveTypeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\LeaveTypeStoreRequest;
use App\Http\Requests\LeaveTypeUpdateRequest;
use App\Http\Resources\LeaveTypeResource;
use App\Models\LeaveType;
use App\Services\LeaveTypeDataService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    protected LeaveTypeDataService $leaveTypeService;

    public function __construct(LeaveTypeDataService $leaveTypeService)
    {
        $this->leaveTypeService = $leaveTypeService;
    }

    public function index()
    {
        $query = LeaveType::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $leavetypes = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $leavetypes->total();
        // Get the count of positions being displayed on the current page
        $currentPageCount = $leavetypes->count();
        $currentPage = $leavetypes->currentPage();



        return inertia("Admin/LeaveType/Index", [
            "leavetypes" => LeaveTypeResource::collection($leavetypes),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(LeaveTypeStoreRequest $request)
    {
        $dto = LeaveTypeData::fromArray($request->validated());

        $this->leaveTypeService->createLeaveType($dto);

        return redirect()->route('leavetype.index')->with([
            'success' => 'Leave Type Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $leavetype = LeaveType::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($leavetype);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LeaveTypeUpdateRequest $request, $id)
    {
        $dto = LeaveTypeData::fromArray($request->validated());

        $this->leaveTypeService->updateLeaveType($dto, $id);


        return redirect()->route('leavetype.index')->with([
            'success' => 'Leave Type Data Updated Successfully!',
        ]);
    }

    public function destroy($id)
    {

        $this->leaveTypeService->deleteLeaveType($id);

        return redirect()->route('leavetype.index')->with(['error' => 'Leave type deleted successfully.']);
    }
}
