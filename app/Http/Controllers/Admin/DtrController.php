<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\DtrData;
use App\DTOs\DtrUpdateData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DtrStoreRequest;
use App\Http\Requests\DtrUpdateRequest;
use App\Http\Resources\DtrResource;
use App\Mail\DtrReportMail;
use App\Models\Division;
use App\Models\Dtr;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use App\Models\Section;
use App\Services\DtrService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class DtrController extends Controller
{
    protected $dtrService;

    public function __construct(DtrService $dtrService)
    {
        $this->dtrService = $dtrService;
    }
    public function index()
    {

        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Dtr::with(['employeeTransaction', 'coordinates'])->orderBy('punch_date', 'desc');

        if ($dateFrom && $dateTo) {
            $query->whereDate('punch_date', '>=', $dateFrom)
                ->whereDate('punch_date', '<=', $dateTo);
        }

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                // Search in DTR columns
                $q->where('employee_id', 'like', "%{$search}%");
                // Search in employee columns
                $q->orWhereHas('employeeTransaction', function ($q2) use ($search) {
                    $q2->where('lastname', 'like', "%{$search}%")
                        ->orWhere('firstname', 'like', "%{$search}%");
                });
            });
        }


        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $dtr = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        try {
            $perPage = request()->input('per_page', 10);
            if (!in_array($perPage, [10, 20, 50, 100])) {
                $perPage = 10; // Default to 10 if an invalid value is provided
            }

            $dtr = $query->orderBy($sortField, $sortDirection)->paginate($perPage)->onEachSide(1);

            $dtr->appends(request()->only(['date_from', 'date_to', 'lastname', 'punch_date', 'sort_field', 'sort_direction']));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error processing request.'], 500);
        }
        $dtr->appends(request()->only(['search', 'per_page', 'sort_field', 'sort_direction']));
        $totalCount = $dtr->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $dtr->count();
        $currentPage = $dtr->currentPage();



        return inertia("Admin/Dtr/Index", [
            "dtrs" => DtrResource::collection($dtr),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }


    public function edit($id)
    {
        $dtr = $this->dtrService->getId($id);

        return response()->json($dtr);
    }

    public function show($id)
    {
        return Dtr::with([
            'coordinates',
            'employeeTransaction'
        ])->findOrFail($id);
    }


    public function update(DtrUpdateRequest $request, $id)
    {
        try {
            $dto = DtrUpdateData::fromArray($request->validated());

            $this->dtrService->updateDtr($dto, $id);

            return back()->with('success', 'Dtr Data Updated Successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update DTR.');
        }
    }

    public function sendDtrEmployeeEmail(DtrService $dtrService)
    {
        $dateFrom = request('date_from');
        $dateTo   = request('date_to');
        $search = request('search');

        $employees = PersonnelEmployee::with('movement')
            ->when($search, fn($q) => $q->where('lastname', 'like', "%{$search}%"))
            ->get();


        foreach ($employees as $employee) {
            $totalAbsent = 0;
            $totalTardinessSeconds = 0;
            $totalUndertimeSeconds = 0;


            if (!filter_var($employee->email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $finalDtr = $dtrService->buildEmployeeDtr(
                $employee->employee_id,
                $dateFrom,
                $dateTo
            );

            if (empty($finalDtr)) {
                continue;
            }


            foreach ($finalDtr as $row) {
                $dayOfWeek = \Carbon\Carbon::parse($row['date'])->format('D');

                // Count ABSENT (excluding FWA-B Friday)
                if (strtoupper(trim($row['status'])) === 'ABSENT' && !($employee->flexi_type === 'FWA-B' && $dayOfWeek === 'Fri')) {
                    $totalAbsent++;
                }

                // Count HALF-DAY as 0.5
                if ($row['status'] === 'HALF-DAY') {
                    $totalAbsent += 0.5;
                }

                // Tardiness & undertime (if DTR exists)
                $dtr = $row['dtr'] ?? null;
                if ($dtr) {
                    $totalTardinessSeconds += $dtrService->timeToSeconds($dtr->tardiness ?? null);
                    $totalUndertimeSeconds += $dtrService->timeToSeconds($dtr->undertime ?? null);
                }
            }

            // Convert seconds back to H:i:s
            $totalTardiness = gmdate('H:i:s', $totalTardinessSeconds);
            $totalUndertime = gmdate('H:i:s', $totalUndertimeSeconds);

            $movement = $employee->movement;

            $sectionChief = $movement?->section_id
                ? Section::with('employeeBy')->find($movement->section_id)?->employeeBy
                : null;

            $divisionChief = $movement?->division_id
                ? Division::with('employeeBy')->find($movement->division_id)?->employeeBy
                : null;

            Mail::to($employee->email)->send(
                new DtrReportMail(
                    $finalDtr,
                    $employee,
                    $sectionChief,
                    $divisionChief,
                    $dateFrom,
                    $dateTo,
                    $totalAbsent,
                    $totalTardiness,
                    $totalUndertime
                )
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'DTR sent to employee email.'
        ]);
    }

    public function showPhoto($filename)
    {
        return $this->dtrService->showPhoto($filename);
    }
}
