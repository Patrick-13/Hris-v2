<?php

namespace App\Http\Controllers\User;

use App\DTOs\PersonnelEmployeeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\PersonnelEmployeeStoreRequest;
use App\Http\Requests\PersonnelEmployeeUpdateRequest;
use App\Http\Resources\PersonnelEmployeeResource;
use App\Models\PersonnelEmployee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PersonnelExport;
use App\Models\Office;
use Maatwebsite\Excel\Excel as MaatExcel;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }
    public function index()
    {
        $query = PersonnelEmployee::query();
        $status = request('status');

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('flexi_type', 'like', "%{$search}%")
                    ->orWhere('employment_status', 'like', "%{$search}%")
                    ->orWhere('gender', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        if (request()->filled('status')) {
            $status = request('status');
            $query->where('employment_status', $status);
        }

        if (request()->filled('emp_status')) {
            $empstatus = request('emp_status');
            $query->where('emp_status', $empstatus);
        }

        if (request()->filled('province_office')) {
            $province_office = request('province_office');
            $query->where('province_office', $province_office);
        }

        // if (request()->filled('flexi_type')) {
        //     $flexi_type = request('flexi_type');
        //     $query->where('flexi_type', $flexi_type);
        // }


        $sortField = request("sort_field", "employee_id");
        $sortDirection = request("sort_direction", "desc");

        $employee = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        try {
            $perPage = request()->input('per_page', 15);
            if (!in_array($perPage, [10, 20, 50, 100])) {
                $perPage = 15; // Default to 10 if an invalid value is provided
            }

            $employee = $query->orderBy($sortField, $sortDirection)->paginate($perPage)->onEachSide(1);

            $employee->appends(request()->only(['per_page', 'search', 'status', 'sort_field', 'sort_direction']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error processing request.'], 500);
        }

        $totalCount = $employee->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $employee->count();
        $currentPage = $employee->currentPage();

        $offices = Office::all();

        return inertia("Admin/PersonelEmployee/Index", [
            "employees" => PersonnelEmployeeResource::collection($employee),
            "offices" => $offices,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(PersonnelEmployeeStoreRequest $request)
    {
        $dto = PersonnelEmployeeData::fromArray($request->validated());

        $this->employeeService->createEmployee($dto);

        return redirect()->route('employee.index')->with([
            'success' => 'Employee Data Created Successfully!'
        ]);
    }

    public function edit($id)
    {
        $personnelemployee = PersonnelEmployee::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($personnelemployee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PersonnelEmployeeUpdateRequest $request, $id)
    {
        $dto = PersonnelEmployeeData::fromArray($request->validated());

        $this->employeeService->updateEmployee($dto, $id);


        return redirect()->back()->with(['success' => 'Employee Data Updated successfully.']);
    }

    public function import_employee(Request $request)
    {
        $request->validate([
            'dtr_file' => 'required|file|mimes:csv,txt',
        ]);

        $this->employeeService->importEmployee(
            $request->file('dtr_file')
        );

        return redirect()
            ->route('employee.index')
            ->with('success', 'Employee data has been successfully imported.');
    }

    public function bulkApprove(Request $request)
    {

        $flexi_type = request('flexi_type');

        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:payrolls,id',
            'flexi_type' => 'required|string',
        ]);

        DB::transaction(function () use ($validated, $flexi_type) {
            foreach ($validated['ids'] as $employeeId) {
                // approve only at current user's level
                $this->employeeService->updateStatus($employeeId, $flexi_type);
            }
        });

        return back()->with([
            'success' => 'Selected Employee requests updated Successfully!',
        ]);
    }

    public function exportExcel()
    {
        return Excel::download(
            new PersonnelExport,
            'personnel.xlsx'
        );
    }

    public function exportCsv()
    {
        return Excel::download(
            new PersonnelExport,
            'personnel.csv',
            MaatExcel::CSV
        );
    }
}
