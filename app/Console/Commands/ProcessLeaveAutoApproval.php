<?php

namespace App\Console\Commands;

use App\Models\LeaveApproval;
use App\Models\PersonnelLeave;
use Illuminate\Console\Command;
use App\Services\EmployeeLeaveService;

class ProcessLeaveAutoApproval extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autoapproved:leave';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto Approved Leave';

    protected EmployeeLeaveService $leaveService;

    public function __construct(EmployeeLeaveService $leaveService)
    {
        parent::__construct();

        $this->leaveService = $leaveService;
    }


    /**
     * Execute the console command.
     */
    public function handle()
    {


        // $approvals = LeaveApproval::where('status', 'pending')
        //     ->whereNotNull('pending_at')
        //     ->where('pending_at', '<=', now()->subHours(24))
        //     ->get();

        $approvals = LeaveApproval::where('status', 'pending')
            ->whereNotNull('pending_at')
            ->get();

        foreach ($approvals as $approval) {

            $waitHours = match ($approval->level) {
                'section'  => 24,
                'division' => 48,
                'rd'       => 48,
                default    => 24,
            };

            // Skip if it hasn't reached its timeout yet
            if ($approval->pending_at->addHours($waitHours)->isFuture()) {
                continue;
            }

            $approval->update([
                'status' => $approval->level === 'rd'
                    ? 'approved'
                    : 'auto-approved',
                'approved_at' => now(),
                'pending_at' => null,
            ]);

            $next = LeaveApproval::where('leave_id', $approval->leave_id)
                ->where('status', 'waiting')
                ->orderBy('id')
                ->first();

            if ($next) {
                $next->update([
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            } else {
                $leave = $approval->leave;

                $allApproved = $leave->approvals()
                    ->whereNotIn('status', ['approved', 'auto-approved'])
                    ->doesntExist();

                if ($allApproved) {
                    $this->leaveService->finalizeLeaveApproval($leave);
                }
            }
        }
    }
}
