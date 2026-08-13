<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeDeviceAssignmentResource;
use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\EmployeeDeviceAssignment;
use App\Services\MyDeviceService;
use Illuminate\Support\Facades\Auth;

class MyDeviceController extends Controller
{
    protected MyDeviceService $myDeviceService;

    public function __construct(MyDeviceService $myDeviceService)
    {
        $this->myDeviceService = $myDeviceService;
    }

    public function index()
    {
        $employeeId = Auth::user()->employee_id;
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // ✅ The service now handles search & pagination
        $employeedevice = $this->myDeviceService->getPersonnelDevices(
            $employeeId,
            $sortField,
            $sortDirection,
            10
        );

        return inertia("User/Device/Index", [
            "employeedevices" => EmployeeDeviceAssignmentResource::collection($employeedevice),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $employeedevice->total(),
            'currentPageCount' => $employeedevice->count(),
            'currentPage' => $employeedevice->currentPage(),
        ]);
    }
}
