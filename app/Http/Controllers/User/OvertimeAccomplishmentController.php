<?php

namespace App\Http\Controllers\User;

use App\DTOs\OvertimeAccomplishmentData;
use App\Http\Controllers\Controller;
use App\Http\Requests\OvertimeAccomplishmentStoreRequest;
use App\Http\Resources\OvertimeAccomplishmentResource;
use App\Http\Resources\PersonnelOvertimeResource;
use App\Models\Accomplishment_approval;
use App\Models\Overtime_accomplishment;
use App\Models\Personnelovertime;
use App\Services\OvertimeAccomplishmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OvertimeAccomplishmentController extends Controller
{
    protected OvertimeAccomplishmentService $overtimeAccomplishmentService;

    public function __construct(OvertimeAccomplishmentService $overtimeAccomplishmentService)
    {
        $this->overtimeAccomplishmentService = $overtimeAccomplishmentService;
    }

    public function index()
    {
        $user = auth()->user(); // ✅ Get logged-in user


        $query = Overtime_accomplishment::with(['overtime.employeeBy', 'approvals.approver']);

        if (request()->filled('search')) {
            $search = request('search');

            $query->whereHas('overtime.employeeBy', function ($q) use ($search) {
                $q->where('lastname', 'like', "%{$search}%")
                    ->orWhere('firstname', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if ($user->role !== 'admin') {
            $query->whereHas('approvals', function ($q) use ($user) {
                $q->where('approver_id', $user->employee_id);
            });

            $query->whereHas('overtime', function ($q) use ($user) {
                $q->where('employee_id', '!=', $user->employee_id);
            });
        }

        $pendingQuery = clone $query;
        $waitingQuery = clone $query;
        $approvedQuery = clone $query;
        $resubmittedQuery = clone $query;

        //pending query
        $aropending = $pendingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'pending')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'overtime.employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'pending_page'
            )
            ->onEachSide(1);

        $aropending->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'pending_page', // preserve the other paginator
            ])
        );

        //waiting query
        $arowaiting = $waitingQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'waiting')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'overtime.employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'waiting_page'
            )
            ->onEachSide(1);

        $arowaiting->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'waiting_page', // preserve the other paginator
            ])
        );

        //waiting query
        $aroapproved = $approvedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'overtime.employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'approved_page'
            )
            ->onEachSide(1);

        $aroapproved->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'approved_page', // preserve the other paginator
            ])
        );

        //resubmitted query
        $aroresubmitted = $resubmittedQuery
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('status', 'resubmitted')
                    ->where('approver_id', $user->employee_id);
            })
            ->with([
                'overtime.employeeBy',
                'approvals.approver',
            ])
            ->orderBy($sortField, $sortDirection)
            ->paginate(
                10,
                ['*'],
                'resubmit_page'
            )
            ->onEachSide(1);

        $aroresubmitted->appends(
            request()->only([
                'search',
                'sort_field',
                'sort_direction',
                'tab',
                'resubmit_page', // preserve the other paginator
            ])
        );


        $totalCount = $aropending->total();
        $currentPageCount = $aropending->count();
        $currentPage = $aropending->currentPage();

        $totalCountwaiting = $arowaiting->total();
        $currentPageCountwaiting = $arowaiting->count();
        $currentPagewaiting = $arowaiting->currentPage();

        $totalCountapproved = $aroapproved->total();
        $currentPageCountapproved = $aroapproved->count();
        $currentPageapproved = $aroapproved->currentPage();

        $totalCountresubmitted = $aroresubmitted->total();
        $currentPageCountresubmitted = $aroresubmitted->count();
        $currentPageresubmitted = $aroresubmitted->currentPage();


        return inertia("User/Accomplishment/Index", [
            "personnelaccomplishments" => OvertimeAccomplishmentResource::collection($aropending),
            "personnelaccomplishmentwaiting" => OvertimeAccomplishmentResource::collection($arowaiting),
            "personnelaccomplishmentapproved" => OvertimeAccomplishmentResource::collection($aroapproved),
            "personnelaccomplishmentresubmitted" => OvertimeAccomplishmentResource::collection($aroresubmitted),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),

            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,

            'totalCountwaiting' => $totalCountwaiting,
            'currentPageCountwaiting' => $currentPageCountwaiting,
            'currentPagewaiting' => $currentPagewaiting,

            'totalCountapproved' => $totalCountapproved,
            'currentPageCountapproved' => $currentPageCountapproved,
            'currentPageapproved' => $currentPageapproved,


            'totalCountresubmitted' => $totalCountresubmitted,
            'currentPageCountresubmitted' => $currentPageCountresubmitted,
            'currentPageresubmitted' => $currentPageresubmitted,
        ]);
    }

    public function attachment($id)
    {
        $employeeovertime = Personnelovertime::where('id', $id)->get();

        return PersonnelOvertimeResource::collection($employeeovertime);
    }

    public function edit(int $id)
    {
        $oa = Overtime_accomplishment::findOrFail($id);

        return new OvertimeAccomplishmentResource($oa);
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'work_accomplished' => 'required|string',
            'duration_hours' => 'required|numeric',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:20480',
        ]);

        $accomplishment = Overtime_accomplishment::findOrFail($id);

        $attachment = $accomplishment->attachment;

        if ($request->hasFile('attachment')) {

            // Delete old file from network disk
            if ($attachment && Storage::disk('network')->exists($attachment)) {
                Storage::disk('network')->delete($attachment);
            }

            $file = $request->file('attachment');

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "aro_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $attachment = $file->storeAs(
                "aro/{$folder}",
                $filename,
                'network'
            );
        }

        $accomplishment->update([
            'work_accomplished' => $request->work_accomplished,
            'duration_hours'    => $request->duration_hours,
            'attachment'        => $attachment,
            'status'            => 'returned',
        ]);

        // Reset approvals
        Accomplishment_approval::where('accomplishment_id', $accomplishment->id)
            ->update([
                'status' => 'waiting',
                'approved_at' => null,
                'returned_at' => null,
            ]);

        $firstApprover = Accomplishment_approval::where('accomplishment_id', $accomplishment->id)
            ->orderBy('level')
            ->first();

        if ($firstApprover) {
            $firstApprover->update([
                'status' => 'resubmitted',
                'resubmitted_at' => now(),
            ]);
        }

        return redirect()->route('myovertime.index')
            ->with('success', 'Updated Successfully and sent back for approval!');
    }

    public function accomplishment(OvertimeAccomplishmentStoreRequest $request, $overtimeId)
    {


        $validated = $request->validated();

        dd($validated);

        foreach ($validated['accomplishments'] as $item) {
            $dto = OvertimeAccomplishmentData::fromArray($item, $overtimeId);
            $this->overtimeAccomplishmentService->createOTAccomplishment($dto);
        }
        return redirect()->route('myovertime.index')->with([
            'success' => 'Employee Render Accomplishment Overtime Created Successfully!'
        ]);
    }

    public function showaccomplishment($id)
    {
        $employeeovertime = Personnelovertime::with('employeeBy', 'accomplishments', 'approvals')
            ->findOrFail($id);

        return new PersonnelOvertimeResource($employeeovertime);
    }



    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:overtime_accomplishments,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $overtimeId) {
                // approve only at current user's level
                $this->overtimeAccomplishmentService->approveAccomplishment($overtimeId, 'approved');
            }
        });

        return back()->with([
            'success' => 'Selected overtime requests approved at your level.',
        ]);
    }


    public function bulkReturned(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:overtime_accomplishments,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $overtimeId) {
                // approve only at current user's level
                $this->overtimeAccomplishmentService->approveAccomplishment($overtimeId, 'returned');
            }
        });

        return back()->with([
            'success' => 'Selected overtime requests returned at your level.',
        ]);
    }


    public function showFile($filename)
    {
        return $this->overtimeAccomplishmentService->showFile($filename);
    }
}
