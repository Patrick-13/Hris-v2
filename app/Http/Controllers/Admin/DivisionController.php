<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\DivisionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DivisionStoreRequest;
use App\Http\Requests\DivisionUpdateRequest;
use App\Http\Resources\DivisionResource;
use App\Models\Division;
use App\Models\PersonnelEmployee;
use App\Services\DivisionService;


class DivisionController extends Controller
{
    protected DivisionService $divisionService;

    public function __construct(DivisionService $divisionService)
    {
        $this->divisionService = $divisionService;
    }
    public function index()
    {
        $query = Division::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $division = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $division->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $division->count();
        $currentPage = $division->currentPage();

        $employees = PersonnelEmployee::all();

        return inertia("Admin/Division/Index", [
            "divisions" => DivisionResource::collection($division),
            "employees" => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(DivisionStoreRequest $request)
    {
        $dto = DivisionData::fromArray($request->validated());

        $this->divisionService->createDivision($dto);

        return redirect()->route('division.index')->with([
            'success' => 'Division Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $division = Division::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($division);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DivisionUpdateRequest $request, $id)
    {
        $dto = DivisionData::fromArray($request->validated());

        $this->divisionService->updateDivision($dto, $id);


        return redirect()->route('division.index')->with([
            'success' => 'Division Data Updated Successfully!',
        ]);
    }
}
