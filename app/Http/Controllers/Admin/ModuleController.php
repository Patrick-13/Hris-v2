<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ModuleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ModuleStoreRequest;
use App\Http\Requests\ModuleUpdateRequest;
use App\Http\Resources\ModuleResource;
use App\Models\Module;
use App\Services\ModuleService;


class ModuleController extends Controller
{
    protected ModuleService $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }
    public function index()
    {
        $query = Module::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $module = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $module->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $module->count();
        $currentPage = $module->currentPage();



        return inertia("Admin/Module/Index", [
            "modules" => ModuleResource::collection($module),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(ModuleStoreRequest $request)
    {
        $dto = ModuleData::fromArray($request->validated());

        $this->moduleService->createModule($dto);

        return redirect()->route('module.index')->with([
            'success' => 'Module Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $module = Module::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($module);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleUpdateRequest $request, $id)
    {
        $dto = ModuleData::fromArray($request->validated());

        $this->moduleService->updateModule($dto, $id);


        return redirect()->route('module.index')->with([
            'success' => 'Module Data Updated Successfully!',
        ]);
    }
}
