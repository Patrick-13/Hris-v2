<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SubmoduleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\SubmoduleStoreRequest;
use App\Http\Requests\SubmoduleUpdateRequest;
use App\Http\Resources\SubmoduleResource;
use App\Models\Module;
use App\Models\Submodule;
use App\Services\SubmoduleService;


class SubmoduleController extends Controller
{
    protected SubmoduleService $submoduleService;

    public function __construct(SubmoduleService $submoduleService)
    {
        $this->submoduleService = $submoduleService;
    }
    public function index()
    {
        $query = Submodule::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $submodule = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $submodule->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $submodule->count();
        $currentPage = $submodule->currentPage();

        $modules = Module::all();


        return inertia("Admin/Submodule/Index", [
            "submodules" => SubmoduleResource::collection($submodule),
            "modules" => $modules,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(SubmoduleStoreRequest $request)
    {
        $dto = SubmoduleData::fromArray($request->validated());

        $this->submoduleService->createSubModule($dto);

        return redirect()->route('submodule.index')->with([
            'success' => 'Submodule Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $submodule = $this->submoduleService->getId($id);

        return response()->json($submodule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SubmoduleUpdateRequest $request, $id)
    {
        $dto = SubmoduleData::fromArray($request->validated());

        $this->submoduleService->updateSubModule($dto, $id);


        return redirect()->route('submodule.index')->with([
            'success' => 'Submodule Data Updated Successfully!',
        ]);
    }
}
