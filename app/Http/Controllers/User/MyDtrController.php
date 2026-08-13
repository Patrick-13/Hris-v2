<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\DtrResource;
use App\Models\ActivityType;
use App\Models\Division;
use App\Models\Dtr;
use App\Models\Office;
use App\Models\PersonnelEmployee;
use App\Models\Section;
use App\Services\Dtr\DtrBuilderService;
use App\Services\DtrService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use setasign\Fpdi\Tcpdf\Fpdi;

class MyDtrController extends Controller
{
    protected $dtrService;
    // protected $builder;

    public function __construct(DtrService $dtrService)
    {
        $this->dtrService = $dtrService;
        // $this->builder = $builder;
    }
    public function index()
    {
        $employeeId = Auth::user()->employee_id;

        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Dtr::with('employeeTransaction') // correct relationship
            ->whereHas('employeeTransaction', function ($q) use ($employeeId) {
                $q->where('employee_id', $employeeId);
            });

        if ($dateFrom && $dateTo) {
            $query->whereDate('punch_date', '>=', $dateFrom)
                ->whereDate('punch_date', '<=', $dateTo);
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $dtr = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
        $totalCount = $dtr->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $dtr->count();
        $currentPage = $dtr->currentPage();

        $employees = PersonnelEmployee::with('movement')
            ->where('employee_id', $employeeId)
            ->first();

        $activityypes = ActivityType::orderBy('name', 'asc')->get();

        return inertia("User/Dtr/Index", [
            "dtrs" => DtrResource::collection($dtr),
            'employees' => $employees,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'activityypes' => $activityypes,
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function punch(Request $request, DtrService $dtrService)
    {
        $request->validate([
            'type' => 'required|in:timeIn,breakOut,breakIn,timeOut',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'photo' => 'nullable|image|max:5120',
        ]);

        $employeeId = auth()->user()->employee_id;

        $dtr = $dtrService->punchManual(
            $employeeId,
            $request->type,
            $request->latitude,
            $request->longitude,
            $request->file('photo')
        );

        return response()->json([
            'success' => true,
            'dtr' => $dtr,
        ]);
    }

    public function geofence()
    {
        $employee = auth()->user()->employeeBy;

        if (!$employee || empty($employee->office_id)) {
            return response()->json([
                'message' => 'No office assigned to this employee.'
            ], 404);
        }

        $offices = Office::whereIn('id', $employee->office_id)->get();

        return response()->json(
            $offices->map(function ($office) {
                return [
                    'id'     => $office->id,
                    'office' => $office->office_name,
                    'lat'    => (float) $office->latitude,
                    'lng'    => (float) $office->longitude,
                    'radius' => (float) $office->radius,
                ];
            })->values()
        );
    }

    public function downloadDtrEmployee(
        Request $request,
        DtrService $dtrService
    ) {
        $dateFrom = $request->date_from;
        $dateTo   = $request->date_to;
        $employeeId = $request->employee_id;
        $totalAbsent = 0;
        $totalTardinessSeconds = 0;
        $totalUndertimeSeconds = 0;
        $totalOvertimeSeconds = 0;

        $employee = PersonnelEmployee::with('movement')
            ->where('employee_id', $employeeId)
            ->firstOrFail();


        $finalDtr = $dtrService->buildEmployeeDtr(
            $employee->employee_id,
            $dateFrom,
            $dateTo
        );

        foreach ($finalDtr as $row) {
            $dayOfWeek = \Carbon\Carbon::parse($row['date'])->format('D');

            // Check if row has S.O / Training S.O / T.O
            $hasSoOrTo =
                !empty($row['soNumber']) ||
                !empty($row['soNumberTraining']) ||
                !empty($row['travel_id']) ||
                !empty($row['memoNumber']);

            $isWeekend = in_array($dayOfWeek, ['Fri', 'Sat', 'Sun']);

            // Count ABSENT (excluding Friday)
            if (strtoupper(trim($row['status'])) === 'ABSENT' && !($dayOfWeek === 'Fri' && !$isWeekend)) {
                $totalAbsent++;
            }

            // Count HALF-DAY as 0.5
            if (
                $row['status'] === 'HALF-DAY'
                && !$hasSoOrTo && !$isWeekend
            ) {
                $totalAbsent += 0.5;
            }

            // Tardiness & undertime (if DTR exists)
            $dtr = (!$hasSoOrTo) ? ($row['dtr'] ?? null) : null;

            if ($dtr) {
                $totalTardinessSeconds += $dtrService->timeToSeconds($dtr->tardiness ?? null);
                $totalUndertimeSeconds += $dtrService->timeToSeconds($dtr->undertime ?? null);
                $totalOvertimeSeconds += $dtrService->timeToSeconds($dtr->overtime ?? null);
            }
        }

        // Convert seconds back to H:i:s
        $totalTardiness = gmdate('H:i:s', $totalTardinessSeconds);
        $totalUndertime = gmdate('H:i:s', $totalUndertimeSeconds);
        $totalOvertime = gmdate('H:i:s', $totalOvertimeSeconds);


        $movement = $employee->movement;


        $sectionChief = $movement?->section_id
            ? Section::with('employeeBy')->find($movement->section_id)?->employeeBy
            : null;

        $divisionChief = $movement?->division_id
            ? Division::with('employeeBy')->find($movement->division_id)?->employeeBy
            : null;

        $isDivisionChiefDtr = $employeeId === ($divisionChief?->employee_id);

        $isSectionChiefDtr = $employeeId === ($sectionChief?->employee_id);

        $isSecretary = in_array($employee->employee_id, ["0094", "0001", "0114", "0105"]);

        $regionalDirector = PersonnelEmployee::where('employee_id', '0159') // example
            ->first();

        $pdf = Pdf::loadView('pdf.dtr', [
            'dtrs'           => $finalDtr,
            'employee'       => $employee,
            'sectionChief'   => $sectionChief,
            'divisionChief'  => $divisionChief,
            'isDivisionChiefDtr' => $isDivisionChiefDtr,
            'isSectionChiefDtr' =>  $isSectionChiefDtr,
            'isSecretary' =>  $isSecretary,
            'regionalDirector' => $regionalDirector,
            'dateFrom'       => $dateFrom,
            'dateTo'         => $dateTo,
            'totalAbsent'   => $totalAbsent,
            'totalTardiness' => $totalTardiness,
            'totalUndertime' => $totalUndertime,
            'totalOvertime' => $totalOvertime
        ])
            ->setPaper('Legal', 'portrait');

        // Generate PDF content
        $pdfContent = $pdf->output();

        // Save temporary file
        $tempFile = storage_path('app/temp_dtr.pdf');
        file_put_contents($tempFile, $pdfContent);

        // Create protected PDF
        $protectedPdf = new Fpdi();

        // Permissions
        $protectedPdf->SetProtection(
            [], // no permissions = cannot edit/copy
            '', // user password (leave blank to open normally)
            'EMB-DTR-OWNER-2026' // owner password
        );

        $pageCount = $protectedPdf->setSourceFile($tempFile);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {

            $template = $protectedPdf->importPage($pageNo);

            $size = $protectedPdf->getTemplateSize($template);

            $orientation = $size['width'] > $size['height']
                ? 'L'
                : 'P';

            $protectedPdf->AddPage(
                $orientation,
                [$size['width'], $size['height']]
            );

            $protectedPdf->useTemplate($template);
        }

        // Generate protected output
        $protectedContent = $protectedPdf->Output('', 'S');

        // Delete temp file
        @unlink($tempFile);

        return response($protectedContent)
            ->header('Content-Type', 'application/pdf')
            ->header(
                'Content-Disposition',
                'attachment; filename="DTR_' .
                    $employee->lastname .
                    '_' .
                    $employee->firstname . '_' .
                    'From: ' . $dateFrom . '_'  . 'To. :' . $dateTo . '.pdf'
            );
    }
}
