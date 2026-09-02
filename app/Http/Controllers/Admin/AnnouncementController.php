<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\AnnouncementData;
use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementStoreRequest;
use App\Http\Requests\AnnouncementUpdateRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Services\AnnouncementService;

class AnnouncementController extends Controller
{
    protected AnnouncementService $announcementSerivce;

    public function __construct(AnnouncementService $announcementSerivce)
    {
        $this->announcementSerivce = $announcementSerivce;
    }

    public function index()
    {
        $query = Announcement::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $announcements = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $announcements->total();
        // Get the count of positions being displayed on the current page
        $currentPageCount = $announcements->count();
        $currentPage = $announcements->currentPage();



        return inertia("Admin/Announcement/Index", [
            "announcements" => AnnouncementResource::collection($announcements),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(AnnouncementStoreRequest $request)
    {
        $dto = AnnouncementData::fromArray($request->validated());

        $this->announcementSerivce->createAnnouncement($dto);

        return redirect()->route('announcement.index')->with([
            'success' => 'Announcement Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $announcement = Announcement::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($announcement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AnnouncementUpdateRequest $request, $id)
    {
        $dto = AnnouncementData::fromArray($request->validated());

        $this->announcementSerivce->updateAnnouncement($dto, $id);


        return redirect()->route('announcement.index')->with([
            'success' => 'Announcement Data Updated Successfully!',
        ]);
    }
}
