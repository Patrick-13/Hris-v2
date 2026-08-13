<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\PositionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\PositionStoreRequest;
use App\Http\Requests\PositionUpdateRequest;
use App\Http\Resources\PositionResource;
use App\Models\Position;
use App\Models\Section;
use App\Services\PositionService;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    protected PositionService $positionService;

    public function __construct(PositionService $positionService)
    {
        $this->positionService = $positionService;
    }
    public function index()
    {
        $query = Position::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $position = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $position->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $position->count();
        $currentPage = $position->currentPage();

        $sections = Section::all();

        return inertia("Admin/Position/Index", [
            "positions" => PositionResource::collection($position),
            "sections" => $sections,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(PositionStoreRequest $request)
    {
        $dto = PositionData::fromArray($request->validated());

        $this->positionService->createPosition($dto);

        return redirect()->route('position.index')->with([
            'success' => 'Position Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $position = $this->positionService->getId($id);

        return response()->json($position);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PositionUpdateRequest $request, $id)
    {
        $dto = PositionData::fromArray($request->validated());

        $this->positionService->updatePosition($dto, $id);


        return redirect()->route('position.index')->with([
            'success' => 'Position Data Updated Successfully!',
        ]);
    }
}
