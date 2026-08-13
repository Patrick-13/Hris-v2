<?php

namespace App\Http\Controllers\User;

use App\DTOs\EmployeeDeviceAssignmentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeDeviceAssignmentStoreRequest;
use App\Http\Requests\EmployeeDeviceAssignmentUpdateRequest;
use App\Http\Resources\EmployeeDeviceAssignmentResource;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\EmployeeDeviceAssignment;
use App\Models\PersonnelEmployee;
use App\Services\EmployeeDeviceAssignmentService;
use Illuminate\Http\Request;

class EmployeeDeviceAssignmentController extends Controller
{
    protected EmployeeDeviceAssignmentService $employeeDeviceAssignmentService;

    public function __construct(EmployeeDeviceAssignmentService $employeeDeviceAssignmentService)
    {
        $this->employeeDeviceAssignmentService = $employeeDeviceAssignmentService;
    }

    public function index()
    {
        $query = EmployeeDeviceAssignment::with(['employeeBy', 'deviceBy']);

        if (request()->filled('search')) {
            $search = request('search');

            $query->where(function ($q) use ($search) {
                $q->orWhereHas('deviceBy', function ($sub) use ($search) {
                    $sub->where('serial_number', 'like', "%{$search}%")
                        ->orWhere('property_number', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })->orWhereHas('employeeBy', function ($sub) use ($search) {
                    $sub->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%");
                })->orWhere('remarks', 'like', "%{$search}%")
                    ->orWhere('assigned_at', 'like', "%{$search}%");
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $employeedevice = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $employeedevice->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $employeedevice->count();
        $currentPage = $employeedevice->currentPage();

        $devices = Device::all();
        $employees = PersonnelEmployee::all();
        $categories = DeviceCategory::all();

        return inertia("Admin/EmployeeDeviceAssignment/Index", [
            "employeedevices" => EmployeeDeviceAssignmentResource::collection($employeedevice),
            'devices' => $devices,
            'employees' => $employees,
            'categories' => $categories,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }
    public function store(EmployeeDeviceAssignmentStoreRequest $request)
    {
        $dto = EmployeeDeviceAssignmentData::fromArray($request->validated());
        try {
            $this->employeeDeviceAssignmentService->createDeviceAssignment($dto);

            return redirect()->route('device-assignment.index')->with([
                'success' => 'Device Assign data Created successfully!'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $employeedeviceassignment = EmployeeDeviceAssignment::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($employeedeviceassignment);
    }

    public function show($id)
    {
        $employeedeviceassignment = EmployeeDeviceAssignment::with(['employeeBy', 'deviceBy'])->findOrFail($id);

        return response()->json($employeedeviceassignment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeDeviceAssignmentUpdateRequest $request, $id)
    {
        $dto = EmployeeDeviceAssignmentData::fromArray($request->validated());

        $this->employeeDeviceAssignmentService->updateDeviceAssignment($dto, $id);

        return redirect()->back()->with(['success' => 'Device Assign data updated successfully.']);
    }
}
