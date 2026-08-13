<?php

namespace App\Http\Controllers\User;

use App\DTOs\HolidayData;
use App\Http\Controllers\Controller;
use App\Http\Requests\HolidayStoreRequest;
use App\Http\Requests\HolidayUpdateRequest;
use App\Http\Resources\HolidayResource;
use App\Models\Holiday;
use App\Services\HolidayService;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    protected HolidayService $holidayService;

    public function __construct(HolidayService $holidayService)
    {
        $this->holidayService = $holidayService;
    }

    public function index()
    {
        $query = Holiday::query();


        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('holiday_date', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }


        $sortField = request("sort_field", "holiday_date");
        $sortDirection = request("sort_direction", "asc");

        $holiday = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $holiday->appends(request()->only(['search', 'sort_field', 'sort_direction']));

        $totalCount = $holiday->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $holiday->count();
        $currentPage = $holiday->currentPage();

        return inertia("User/Holiday/Index", [
            "holidays" => HolidayResource::collection($holiday),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(HolidayStoreRequest $request)
    {
        $dto = HolidayData::fromArray($request->validated());

        $this->holidayService->createHoliday($dto);

        return redirect()->back()->with(['success' => 'Holiday data Created successfully.']);
    }

    public function edit($id)
    {
        $job = $this->holidayService->getId($id); // or just find($id) if you don’t want it to 404

        return response()->json($job);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HolidayUpdateRequest $request, $id)
    {
        $dto = HolidayData::fromArray($request->validated());

        $this->holidayService->updateholiday($dto, $id);

        return redirect()->back()->with(['success' => 'Holiday data updated successfully.']);
    }
}
