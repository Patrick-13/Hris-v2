<?php

namespace App\Http\Controllers\Api;

use App\DTOs\PersonnelEmployeeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\PersonnelEmployeeStoreRequest;
use App\Http\Requests\PersonnelEmployeeUpdateRequest;
use App\Http\Resources\IclockTransactionResource;
use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\IclockTransaction;
use App\Models\PersonnelEmployee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function indexApi()
    {
        // Use your service
        $employees = $this->employeeService->getEmployees();

        return response()->json($employees);
    }

    public function showApi(int $employeeId)
    {
        $employee = $this->employeeService->getEmployeeId($employeeId);

        return new PersonnelEmployeeResource($employee);
    }

    public function meApi(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated user'
            ], 401);
        }

        $employee = PersonnelEmployee::with([
            'movement.companyBy',
            'movement.divisionBy',
            'movement.sectionBy',
            'movement.positionBy',
        ])
            ->where('employee_id', $user->employee_id)
            ->first();

        if (!$employee) {
            return response()->json([
                'message' => 'Employee not found'
            ], 404);
        }

        return new PersonnelEmployeeResource($employee);
    }

    public function IclocktransactionApi()
    {
        $transactions = IclockTransaction::with('employee_transaction')
            ->paginate(20);

        return IclockTransactionResource::collection($transactions);
    }
}
