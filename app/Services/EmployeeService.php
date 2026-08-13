<?php

namespace App\Services;

use App\DTOs\PersonnelEmployeeData;
use App\Jobs\SyncZkEmployeeJob;
use App\Models\LeaveCredit;
use App\Models\LeaveType;
use App\Models\PersonnelEmployee;
use App\Models\Personnelemployeearea;
use App\Models\Personnelemployeedevice;
use App\Models\User;
use App\Models\Usermodule;
use App\Models\Usersubmodule;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class EmployeeService
{

    public function createEmployee(PersonnelEmployeeData $data): PersonnelEmployee
    {
        // Step 1: Wrap DB operations in a transaction
        try {
            $employee = DB::transaction(function () use ($data) {
                $empstatus = $data->emp_status === 'Active' ? 0 : 1;
                // 1️⃣ Create HR Employee
                $employee = PersonnelEmployee::create([
                    'employee_id' => $data->employee_id,
                    'lastname' => $data->lastname,
                    'firstname' => $data->firstname,
                    'middlename' => $data->middlename,
                    'nickname' => $data->nickname,
                    'email' => $data->email,
                    'date_of_birth' => $data->date_of_birth,
                    'gender' => $data->gender,
                    'civil_status' => $data->civil_status,
                    'citizenship' => $data->citizenship,
                    'weight' => $data->weight,
                    'height' => $data->height,
                    'bloodtype' => $data->bloodtype,
                    'gsis' => $data->gsis,
                    'pagibig_number' => $data->pagibig_number,
                    'sss_number' => $data->sss_number,
                    'philhealth_number' => $data->philhealth_number,
                    'TIN' => $data->TIN,
                    'date_hired' => $data->date_hired,
                    'emp_status' => $empstatus,
                    'employment_status' => $data->employment_status,
                    'flexi_type' => $data->flexi_type,
                    'in_office' => $data->in_office,
                    'office_id' => $data->office_id,
                    'daily_rate' => $data->daily_rate,
                    'account_no' => $data->account_no,
                    'fundtype' => $data->fundtype,
                    'charging' => $data->charging,
                    'province_office' => $data->province_office
                ]);

                // 2️⃣ Create User account
                $firstInitial = strtolower(substr($employee->firstname, 0, 1));
                $secondInitial = strtolower($employee->middlename ? substr($employee->middlename, 0, 1) : '');
                $username = strtolower($employee->lastname) . '.' . $firstInitial . $secondInitial;
                $password = strtolower($employee->lastname) . '/' . Carbon::parse($employee->date_of_birth)->format('m/d/Y');

                $user = User::firstOrCreate(
                    ['employee_id' => $employee->employee_id],
                    [
                        'name' => $username,
                        'email' => $employee->email,
                        'password' => Hash::make($password),
                    ]
                );

                foreach ([1, 5, 8, 10, 11, 12, 13, 14, 17] as $moduleId) {
                    Usermodule::firstOrCreate([
                        'user_id' => $user->id,
                        'module_id' => $moduleId,
                    ]);
                }

                foreach ([2, 5, 6, 8, 20, 22] as $submoduleId) {
                    Usersubmodule::firstOrCreate([
                        'user_id' => $user->id,
                        'submodule_id' => $submoduleId
                    ]);
                }

                // 3️⃣ Generate next emp_code (non-blocking) F
                $lastEmpCode = Personnelemployeedevice::where('company_id', 1)
                    ->selectRaw('MAX(CAST(emp_code AS UNSIGNED)) as max_code')
                    ->value('max_code');

                $nextEmpCode = ((int)$lastEmpCode) + 1;



                // 4️⃣ Create Device Employee
                $deviceEmployee = Personnelemployeedevice::create([
                    'emp_code' => $nextEmpCode,
                    'emp_code_digit' => $nextEmpCode,
                    'employee_id' => $employee->employee_id,
                    'first_name' => $employee->firstname,
                    'last_name' => $employee->lastname,
                    'status' => 0,
                    'is_active' => 1,
                    'enroll_sn' => 'HWM4252300213',
                    'dev_privilege' => 0,
                    'verify_mode' => 0,
                    'hire_date' => $employee->date_hired,
                    'enable_payroll' => 1,
                    'app_status' => 0,
                    'app_role' => 1,
                    'company_id' => 1,
                    'create_time' => now(),
                    'change_time' => now(),
                ]);

                // 5️⃣ Assign employee to device area (needed for MB560 sync)
                Personnelemployeearea::firstOrCreate([
                    'employee_id' => $deviceEmployee->id,
                    'area_id' => 2, // <-- make sure area 2 is linked to your MB560
                ]);

                return $employee;
            });
        } catch (QueryException $e) {

            // MySQL duplicate key error code = 1062
            if ($e->errorInfo[1] == 1062) {
                throw ValidationException::withMessages([
                    'email' => 'This email address already exists.',
                ]);
            }

            throw $e; // rethrow if not duplicate
        }

        // Step 2: Push employee to ZKBioTime API and resync to device
        $deviceEmployee = Personnelemployeedevice::where(
            'employee_id',
            $employee->employee_id
        )->first();

        if (! $deviceEmployee) {
            return $employee;
        }

        $zk = app(ZkBioTimeService::class);

        try {
            /** 1️⃣ Create employee in ZKBioTime */
            $zkCreateResponse = Http::withHeaders([
                'Authorization' => 'JWT ' . $zk->getToken(),
            ])
                ->timeout(60)
                ->retry(3, 500)
                ->post(config('services.zkbiotime.url') . '/personnel/api/employees/', [
                    'emp_code'   => $deviceEmployee->emp_code,
                    'department' => 1,   // ✅ MUST be department PK
                    'area'       => [2],    // ✅ MUST be array
                    'app_status' => 1
                ]);

            if ($zkCreateResponse->failed()) {
                throw new \Exception('ZK Create failed: ' . $zkCreateResponse->body());
            }

            /** 2️⃣ Save ZK employee ID */
            $zkEmployeeId = $zkCreateResponse->json('id');

            if (! $zkEmployeeId) {
                throw new \Exception('ZK employee ID not returned');
            }

            $deviceEmployee->update([
                'zk_employee_id' => $zkEmployeeId,
            ]);

            /** 3️⃣ Resync ONLY this employee to device */
            $zkSyncResponse = Http::withHeaders([
                'Authorization' => 'JWT ' . $zk->getToken(),
            ])
                ->timeout(60)
                ->post(
                    config('services.zkbiotime.url') . '/personnel/api/employees/resync_to_device/',
                    [
                        'employees' => [$zkEmployeeId],
                    ]
                );

            if ($zkSyncResponse->failed()) {
                throw new \Exception('ZK Sync failed: ' . $zkSyncResponse->body());
            }

            Log::info('ZK employee synced successfully', [
                'employee_id'    => $employee->employee_id,
                'emp_code'       => $deviceEmployee->emp_code,
                'zk_employee_id' => $zkEmployeeId,
            ]);
        } catch (\Exception $e) {
            Log::error('ZK Sync failed', [
                'employee_id' => $employee->employee_id,
                'error'       => $e->getMessage(),
            ]);
        }

        /** -------------------------------
         * STEP 3: LEAVE CREDITS
         * ------------------------------- */
        $currentYear = now()->year;

        $leaveTypes = LeaveType::query();

        $leaveTypes
            ->when($employee->employment_status === 'Contractual', function ($query) {
                $query->whereIn('id', [9, 10]);
            })
            ->when(strtolower($employee->gender) === 'male', function ($query) {
                $query->where('id', '!=', 4);
            })
            ->when(strtolower($employee->gender) === 'female', function ($query) {
                $query->where('id', '!=', 5);
            });

        foreach ($leaveTypes->get() as $leaveType) {
            LeaveCredit::firstOrCreate(
                [
                    'employee_id'   => $employee->employee_id,
                    'leave_type_id' => $leaveType->id,
                    'year'          => $currentYear,
                ],
                [
                    'entitled' => 0,
                    'used'     => 0,
                    'balance'  => 0,
                ]
            );
        }

        return $employee;
    }


    public function updateEmployee(PersonnelEmployeeData $data, int $id): PersonnelEmployee
    {
        $personnelemployee = PersonnelEmployee::findOrFail($id);

        $oldEmployeeCode = $personnelemployee->employee_id;

        $personnelemployee->update([
            'employee_id' => $data->employee_id,
            'lastname' => $data->lastname,
            'firstname' => $data->firstname,
            'middlename' => $data->middlename,
            'nickname' => $data->nickname,
            'email' => $data->email,
            'date_of_birth' => $data->date_of_birth,
            'gender' => $data->gender,
            'civil_status' => $data->civil_status,
            'citizenship' => $data->citizenship,
            'weight' => $data->weight,
            'height' => $data->height,
            'bloodtype' => $data->bloodtype,
            'gsis' => $data->gsis,
            'pagibig_number' => $data->pagibig_number,
            'sss_number' => $data->sss_number,
            'philhealth_number' => $data->philhealth_number,
            'TIN' => $data->TIN,
            'date_hired' => $data->date_hired,
            'emp_status' => $data->emp_status,
            'employment_status' => $data->employment_status,
            'flexi_type' => $data->flexi_type,
            'in_office' => $data->in_office,
            'office_id' => $data->office_id,
            'daily_rate' => $data->daily_rate,
            'account_no' => $data->account_no,
            'fundtype' => $data->fundtype,
            'charging' => $data->charging,
            'province_office' => $data->province_office
        ]);

        if ($data->employee_id) {
            User::where('employee_id', $data->employee_id)
                ->update([
                    'email' => $data->email,
                    'status' => $data->emp_status
                ]);
        }

        Personnelemployeedevice::where('employee_id', $oldEmployeeCode)
            ->update(['employee_id' => $data->employee_id]);

        return $personnelemployee;
    }

    public function getEmployees()
    {
        return PersonnelEmployee::all();
    }

    public function getEmployeeId(int $employeeId)
    {
        return  PersonnelEmployee::where('employee_id', $employeeId)->first();
    }

    public function importEmployee(UploadedFile $file): void
    {
        $filePath = $file->getRealPath();
        $data = array_map('str_getcsv', file($filePath));

        $employees = [];
        $deviceEmployees = [];
        $defaultModules = [1, 5, 8, 10, 11, 12, 13, 14, 17];
        $defaultSubmodules = [5, 6, 8, 20, 22];

        foreach ($data as $rowIndex => $row) {
            if ($rowIndex === 0) continue; // skip header

            $employees[] = [
                'employee_id' => $row[1],
                'lastname'    => $row[2],
                'firstname'   => $row[3],
                'middlename'  => $row[4],
                'nickname'    => $row[5],
                'email'       => $row[6] ?? null,
                'date_of_birth' => !empty($row[7]) ? date('Y-m-d', strtotime($row[7])) : null,
                'gender'      => $row[8] ?? null,
                'civil_status' => $row[9] ?? null,
                'citizenship' => $row[10] ?? null,
                'weight'      => $row[11] ?? null,
                'height'      => $row[12] ?? null,
                'bloodtype'   => $row[13] ?? null,
                'gsis'        => $row[14] ?? null,
                'pagibig_number' => $row[15] ?? null,
                'sss_number'     => $row[16] ?? null,
                'philhealth_number' => $row[17] ?? null,
                'date_hired'  => !empty($row[18]) ? date('Y-m-d', strtotime($row[18])) : null,
                'emp_status'  => $row[19] === 'Active' ? 0 : 1,
                'employment_status' => $row[20] ?? null,
                'flexi_type'  => $row[21] ?? null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        // 1️⃣ Bulk upsert employees
        PersonnelEmployee::upsert(
            $employees,
            ['employee_id'],
            ['lastname', 'firstname', 'middlename', 'nickname', 'email', 'date_of_birth', 'gender', 'civil_status', 'citizenship', 'weight', 'height', 'bloodtype', 'gsis', 'pagibig_number', 'sss_number', 'philhealth_number', 'date_hired', 'emp_status', 'employment_status', 'flexi_type', 'updated_at']
        );

        // Prepare device employee
        $lastEmpCode = Personnelemployeedevice::where('company_id', 1)
            ->selectRaw('MAX(CAST(emp_code AS UNSIGNED)) as max_code')
            ->value('max_code');
        $nextEmpCode = ((int)$lastEmpCode) + 1;


        // 2️⃣ Create users and collect device employee data
        foreach ($employees as $employeeData) {
            $employee = PersonnelEmployee::where('employee_id', $employeeData['employee_id'])->first();

            $firstInitial  = strtolower(substr($employee->firstname, 0, 1));
            $secondInitial = strtolower($employee->middlename ? substr($employee->middlename, 0, 1) : '');
            $username      = strtolower($employee->lastname) . '.' . $firstInitial . $secondInitial;
            $password = strtolower($employee->lastname) . '/' . Carbon::parse($employee->date_of_birth)->format('m/d/Y');

            $user = User::firstOrCreate(
                ['employee_id' => $employee->employee_id],
                [
                    'name'     => $username,
                    'email'    => $employee->email,
                    'password' => Hash::make($password),
                ]
            );

            // Assign default modules/submodules (can also be queued)
            foreach ($defaultModules as $moduleId) {
                Usermodule::firstOrCreate(['user_id' => $user->id, 'module_id' => $moduleId]);
            }
            foreach ($defaultSubmodules as $submoduleId) {
                Usersubmodule::firstOrCreate(['user_id' => $user->id, 'submodule_id' => $submoduleId]);
            }

            while (
                Personnelemployeedevice::where('company_id', 1)->where('emp_code', $nextEmpCode)->exists()
                || collect($deviceEmployees)->pluck('emp_code')->contains($nextEmpCode)
            ) {
                $nextEmpCode++;
            }

            $deviceEmployees[] = [
                'emp_code' => $nextEmpCode,
                'emp_code_digit' => $nextEmpCode,
                'employee_id' => $employee->employee_id,
                'first_name' => $employee->firstname,
                'last_name'  => $employee->lastname,
                'status'     => 0,
                'is_active'  => 1,
                'enroll_sn'  => 'HWM4252300213',
                'dev_privilege' => 0,
                'verify_mode'   => 0,
                'hire_date'     => $employee->date_hired,
                'enable_payroll' => 1,
                'app_status'    => 0,
                'app_role'      => 1,
                'company_id'    => 1,
                'create_time'   => now(),
                'change_time'   => now(),
            ];

            $nextEmpCode++;
        }

        // 3️⃣ Bulk insert device employees
        Personnelemployeedevice::insert($deviceEmployees);


        // 4️⃣ Queue ZK sync jobs
        foreach ($deviceEmployees as $device) {
            $deviceModels = Personnelemployeedevice::whereIn(
                'emp_code',
                collect($deviceEmployees)->pluck('emp_code')
            )->get()->keyBy('emp_code');
            $deviceModel = $deviceModels[$device['emp_code']];

            SyncZkEmployeeJob::dispatch([$deviceModel->id]);
            Personnelemployeearea::firstOrCreate([
                'employee_id' => $deviceModel->id,
                'area_id' => 2,
            ]);
        }

        // 5️⃣ Assign leave credits (can also be queued)
        $currentYear = now()->year;
        foreach ($employees as $employeeData) {
            $employeeId = $employeeData['employee_id'];
            foreach (LeaveType::all() as $leaveType) {
                LeaveCredit::firstOrCreate(
                    [
                        'employee_id'   => $employeeId,
                        'leave_type_id' => $leaveType->id,
                        'year'          => $currentYear,
                    ],
                    [
                        'entitled' => 0,
                        'used'     => 0,
                        'balance'  => 0,
                    ]
                );
            }
        }
    }

    public function updateStatus($employeeId,  $flexi_type)
    {
        // ✅ Find the approval record
        $approval = PersonnelEmployee::where('id', $employeeId)->firstOrFail();

        // ✅ Update approval status
        $approval->update([
            'flexi_type' => $flexi_type
        ]);

        return true;
    }
}
