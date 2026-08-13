<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\OfficeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeStoreRequest;
use App\Http\Requests\OfficeUpdateRequest;
use App\Http\Resources\OfficeResource;
use App\Models\Office;
use App\Services\OfficeService;


class OfficeController extends Controller
{
    protected OfficeService $officeService;

    public function __construct(OfficeService $officeService)
    {
        $this->officeService = $officeService;
    }

    public function index()
    {
        $query = Office::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $office = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $office->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $office->count();
        $currentPage = $office->currentPage();

        return inertia("Admin/Office/Index", [
            "offices" => OfficeResource::collection($office),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(OfficeStoreRequest $request)
    {
        $dto = OfficeData::fromArray($request->validated());

        $this->officeService->createOffice($dto);

        return redirect()->route('office.index')->with([
            'success' => 'Office Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $office = Office::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($office);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OfficeUpdateRequest $request, $id)
    {
        $dto = OfficeData::fromArray($request->validated());

        $this->officeService->updateOffice($dto, $id);


        return redirect()->route('office.index')->with([
            'success' => 'Office Data Updated Successfully!',
        ]);
    }
}
