<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\CategoryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\DeviceCategory;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $query = DeviceCategory::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $categories = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $categories->total();
        // Get the count of positions being displayed on the current page
        $currentPageCount = $categories->count();
        $currentPage = $categories->currentPage();



        return inertia("Admin/Category/Index", [
            "categories" => CategoryResource::collection($categories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(CategoryStoreRequest $request)
    {
        $dto = CategoryData::fromArray($request->validated());

        $this->categoryService->createCategory($dto);

        return redirect()->route('category.index')->with([
            'success' => 'Category Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $category = DeviceCategory::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryUpdateRequest $request, $id)
    {
        $dto = CategoryData::fromArray($request->validated());

        $this->categoryService->updateCategory($dto, $id);


        return redirect()->route('category.index')->with([
            'success' => 'Category Data Updated Successfully!',
        ]);
    }
}
