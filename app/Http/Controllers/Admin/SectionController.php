<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SectionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\SectionStoreRequest;
use App\Http\Requests\SectionUpdateRequest;
use App\Http\Resources\SectionResource;
use App\Models\Division;
use App\Models\PersonnelEmployee;
use App\Models\Section;
use App\Services\SectionService;

class SectionController extends Controller
{
    protected SectionService $sectionService;

    public function __construct(SectionService $sectionService)
    {
        $this->sectionService = $sectionService;
    }
    public function index()
    {
        $query = Section::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $section = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $section->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $section->count();
        $currentPage = $section->currentPage();

        $divisions = Division::all();
        $employees = PersonnelEmployee::orderBy('lastname', 'asc')->get();

        return inertia("Admin/Section/Index", [
            "sections" => SectionResource::collection($section),
            "divisions" => $divisions,
            "employees" => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(SectionStoreRequest $request)
    {
        $dto = SectionData::fromArray($request->validated());

        $this->sectionService->createSection($dto);

        return redirect()->route('section.index')->with([
            'success' => 'Section Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $section = $this->sectionService->getId($id);

        return response()->json($section);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SectionUpdateRequest $request, $id)
    {
        $dto = SectionData::fromArray($request->validated());

        $this->sectionService->updateSection($dto, $id);


        return redirect()->route('section.index')->with([
            'success' => 'Section Data Updated Successfully!',
        ]);
    }
}
