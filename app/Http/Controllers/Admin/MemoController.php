<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\MemoData;
use App\Http\Controllers\Controller;
use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Http\Resources\MemoResource;
use App\Models\Memo;
use App\Services\MemoService;
use Illuminate\Http\Request;

class MemoController extends Controller
{
    protected MemoService $memoService;

    public function __construct(MemoService $memoService)
    {
        $this->memoService = $memoService;
    }

    public function index()
    {
        $query = Memo::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $memos = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $memos->total();
        // Get the count of positions being displayed on the current page
        $currentPageCount = $memos->count();
        $currentPage = $memos->currentPage();



        return inertia("Admin/Memo/Index", [
            "memos" => MemoResource::collection($memos),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(MemoStoreRequest $request)
    {
        $dto = MemoData::fromArray($request->validated());

        $this->memoService->createMemo($dto);

        return redirect()->route('memo.index')->with([
            'success' => 'Memo Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $memo = Memo::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($memo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MemoUpdateRequest $request, $id)
    {
        $dto = MemoData::fromArray($request->validated());

        $this->memoService->updateMemo($dto, $id);


        return redirect()->route('memo.index')->with([
            'success' => 'Memo Data Updated Successfully!',
        ]);
    }
}
