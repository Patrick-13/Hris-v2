<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\FormTypeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\TypeFormStoreRequest;
use App\Http\Requests\TypeFormUpdateRequest;
use App\Http\Resources\TypeFormResource;
use App\Models\Formtype;
use App\Services\FormTypeService;


class FormTypeController extends Controller
{
    protected FormTypeService $formTypeService;

    public function __construct(FormTypeService $formTypeService)
    {
        $this->formTypeService = $formTypeService;
    }

    public function index()
    {
        $query = Formtype::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $typeform = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $typeform->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $typeform->count();
        $currentPage = $typeform->currentPage();

        return inertia("Admin/TypeForms/Index", [
            "typeforms" => TypeFormResource::collection($typeform),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(TypeFormStoreRequest $request)
    {
        $dto = FormTypeData::fromArray($request->validated());

        $this->formTypeService->createFormType($dto);

        return redirect()->route('typeform.index')->with([
            'success' => 'Form Type Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $formtype = Formtype::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($formtype);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TypeFormUpdateRequest $request, $id)
    {
        $dto = FormTypeData::fromArray($request->validated());

        $this->formTypeService->updateFormType($dto, $id);


        return redirect()->route('typeform.index')->with([
            'success' => 'Form Type Data Updated Successfully!',
        ]);
    }
}
