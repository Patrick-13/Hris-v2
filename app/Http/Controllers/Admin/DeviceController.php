<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\DeviceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeviceStoreRequest;
use App\Http\Requests\DeviceUpdateRequest;
use App\Http\Resources\DeviceResource;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Services\DeviceService;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    protected DeviceService $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }
    public function index()
    {
        $query = Device::query();

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('serial_number', 'like', "%{$search}%")
                    ->orWhere('fundType', 'like', "%{$search}%")
                    ->orWhere('ppeType', 'like', "%{$search}%")
                    ->orWhere('parNo', 'like', "%{$search}%")
                    ->orWhere('property_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('unitofMeasure', 'like', "%{$search}%")
                    ->orWhere('remarks', 'like', "%{$search}%");
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $device = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $device->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $device->count();
        $currentPage = $device->currentPage();

        $categories = DeviceCategory::all();

        return inertia("Admin/Device/Index", [
            "devices" => DeviceResource::collection($device),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'categories' => $categories,
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(DeviceStoreRequest $request)
    {
        $dto = DeviceData::fromArray($request->validated());

        $this->deviceService->createDevice($dto);

        return redirect()->route('device.index')->with([
            'success' => 'Device Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $device = Device::with('categoryBy')->find($id); // or just find($id) if you don’t want it to 404

        return response()->json($device);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DeviceUpdateRequest $request, $id)
    {
        $dto = DeviceData::fromArray($request->validated());

        $this->deviceService->updateDevice($dto, $id);


        return redirect()->route('device.index')->with([
            'success' => 'Device Data Updated Successfully!',
        ]);
    }
}
