<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ButtonResource;
use Illuminate\Http\Request;
use App\Models\Button;

class ButtonController extends Controller
{
    public function index()
    {
        $query = Button::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $button = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $button->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $button->count();
        $currentPage = $button->currentPage();

        return inertia("Admin/Button/Index", [
            "buttons" => ButtonResource::collection($button),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'buttonName' => 'nullable|string',
        ]);

        Button::create($data);


        return redirect()->route('button.index')->with([
            'success' => 'Module Data Created Successfully!',
        ]);
    }

    public function edit($id)
    {
        $button = Button::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($button);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate input
        $validated = $request->validate([
            'buttonName' => 'nullable|string',
        ]);

        // Find the managing head record
        $button = Button::findOrFail($id);

        // Update the record
        $button->update($validated);


        return redirect()->route('button.index')->with([
            'success' => 'Button Data Update Successfully!',
        ]);
    }
}
