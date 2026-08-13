<?php

namespace App\Services;

use App\DTOs\TkoApprovalData;
use App\DTOs\TkoData;
use App\Models\Division;
use App\Models\Dtr;
use App\Models\EmployeeMovement;
use App\Models\Position;
use App\Models\Tko;
use App\Models\Tko_approval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TkoService
{

    public function __construct(
        protected DtrService $dtrService
    ) {}
    public function store(TkoData $dto): Tko
    {
        $path = null;

        if ($dto->attachment_file) {
            $file = $dto->attachment_file;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "tko_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs("tko/{$folder}", $filename, 'network');
        }

        $exists = Tko::where('employee_id', $dto->employee_id)
            ->whereDate('date', $dto->date)
            ->where('tko_time', $dto->tko_time)
            ->where('tko_type', $dto->tko_type)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'date' => 'You have already submitted this TKO request.'
            ]);
        }

        $tko = Tko::create([
            'employee_id' => $dto->employee_id,
            'tko_type' => $dto->tko_type,
            'date' => $dto->date,
            'tko_time' => $dto->tko_time,
            'attachment_file' => $path ? $path : null,
            'remarks' => $dto->remarks,
        ]);

        $this->createApprovalsForTko($tko);

        return $tko;
    }

    public function getId(int $id): Tko
    {
        return Tko::findOrFail($id);
    }

    public function updateTko(TkoData $dto, int $id): Tko
    {
        $tko = Tko::findOrFail($id);

        $path = null;

        if ($dto->attachment_file) {
            $file = $dto->attachment_file;

            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', "tko_attachments");
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs("tko/{$folder}", $filename, 'network');
        }

        $tko->update([
            'employee_id' => $dto->employee_id,
            'tko_type' => $dto->tko_type,
            'date' => $dto->date,
            'tko_time' => $dto->tko_time,
            'attachment_file' => $path ? $path : null,
            'remarks' => $dto->remarks,
        ]);

        return $tko;
    }

    private function createApprovalsForTko(Tko $tko): void
    {
        $movement = EmployeeMovement::where('employee_id', $tko->employee_id)
            ->latest()
            ->first();

        if (!$movement) return;

        $employeeId = $tko->employee_id;

        $sectionChief = $movement->sectionBy?->employeeBy?->employee_id;
        $divisionChief = $movement->divisionBy?->employeeBy?->employee_id;
        $rd = "0159";
        $hrOfficer = "0153";
        $approvers = [];

        // --------------------------------------------------
        // CASE 1: If DIVISION CHIEF is the one filing TKO
        // APPROVAL: RD → HR
        // --------------------------------------------------
        if ($employeeId === $divisionChief) {

            if ($divisionChief) {
                $approvers[] = [
                    'id' => $rd,
                    'level' => 'division'
                ];
            }

            if ($hrOfficer) {
                $approvers[] = [
                    'id' => $hrOfficer,
                    'level' => 'hr'
                ];
            }
        } else if ($employeeId === $sectionChief) {
            // --------------------------------------------------
            // CASE 2: If SECTION CHIEF is the one filing TKO
            // APPROVAL: DIVISION → HR
            // --------------------------------------------------
            if ($divisionChief) {
                $approvers[] = [
                    'id' => $divisionChief,
                    'level' => 'division'
                ];
            }

            if ($hrOfficer) {
                $approvers[] = [
                    'id' => $hrOfficer,
                    'level' => 'hr'
                ];
            }
        } else {

            // --------------------------------------------------
            // CASE 3: Regular employee filing TKO
            // APPROVAL: SECTION → HR
            // --------------------------------------------------

            if ($sectionChief) {
                $approvers[] = [
                    'id' => $sectionChief,
                    'level' => 'section'
                ];
            }

            if ($hrOfficer) {
                $approvers[] = [
                    'id' => $hrOfficer,
                    'level' => 'hr'
                ];
            }
        }

        // Store approvals in order
        foreach ($approvers as $index => $approver) {
            $approval = $this->storeApproval(
                new TkoApprovalData(
                    $tko->id,
                    $approver['id'],
                    $approver['level']
                )
            );
            // First approver = active
            if ($index === 0) {
                $approval->update([
                    'status' => 'pending',
                ]);
            } else {
                $approval->update([
                    'status' => 'waiting',
                ]);
            }
        }
    }



    public function storeApproval(TkoApprovalData $data): Tko_approval
    {
        return Tko_approval::create([
            'tko_id'    => $data->tko_id,
            'approver_id' => $data->approver_id,
            'level'       => $data->level,
            'status'      => $data->status,
            'approved_at' => $data->approved_at,
        ]);
    }

    public function approveTko($tkoId, $status, $remarks)
    {
        $approverId = Auth::user()->employee_id;

        // ✅ Find the approval record
        $approval = Tko_approval::where('tko_id', $tkoId)
            ->where('approver_id', $approverId)
            ->firstOrFail();

        // ✅ Update approval status
        $approval->update([
            'status' => $status,
            'approved_at' => now(),
        ]);

        $tko = $approval->tko;


        if ($status === 'rejected') {

            $approval->update([
                'remarks' => $remarks,
            ]);

            //cancel all remaining waiting approvals
            Tko_approval::where('tko_id', $tkoId)
                ->where('status', 'waiting')
                ->update([
                    'status' => 'cancelled',
                ]);

            return true;
        }

        // ✅ Check if all approvers have approved
        if (in_array($status, ['approved'])) {
            $next = Tko_approval::where('tko_id', $tkoId)
                ->where('status', 'waiting')
                ->orderBy('level')
                ->first();

            if ($next) {
                $next->update([
                    'status' => 'pending'
                ]);
            }
        }

        $allApproved = $tko->approvals()
            ->where('status', '!=', 'approved')
            ->count() === 0;

        if ($allApproved) {
            $tko->update(['status' => 'approved']);

            $this->applyTkoToDtr($tko);
        }

        return true;
    }

    private function applyTkoToDtr(Tko $tko)
    {
        $dtr = Dtr::where('employee_id', $tko->employee_id)
            ->where('punch_date', $tko->date)
            ->first();

        if (!$dtr) return;

        switch ($tko->tko_type) {

            case 'timeIn':
                if (empty($dtr->timeIn)) {
                    $dtr->timeIn = $tko->tko_time;
                }
                break;

            case 'breakOut':
                if (empty($dtr->breakOut)) {
                    $dtr->breakOut = $tko->tko_time;
                }
                break;

            case 'breakIn':
                if (empty($dtr->breakIn)) {
                    $dtr->breakIn = $tko->tko_time;
                }
                break;

            case 'timeOut':
                if (empty($dtr->timeOut)) {
                    $dtr->timeOut = $tko->tko_time;
                }
                break;
        }

        $dtr->save();

        // 🔥 ALWAYS RECALCULATE AFTER UPDATE
        $this->dtrService->calculateDtr($dtr);
    }

    public function showFile(string $filename)
    {
        $filename = urldecode($filename);

        if (!Storage::disk('network')->exists($filename)) {
            abort(404, 'File not found');
        }

        $mimeType = Storage::disk('network')->mimeType($filename);

        return response(
            Storage::disk('network')->get($filename),
            200
        )->header('Content-Type', $mimeType);
    }


    public function getEmployeeTkoCount($employeeId)
    {
        return Tko::where('employee_id', $employeeId)
            ->whereHas('approvals', function ($q) {
                $q->where('status', 'approved');
            })
            ->count();
    }
}
