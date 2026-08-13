<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Models\Dtr;
use App\Models\LeaveCredit;
use App\Models\LeaveRefund;
use App\Models\Memo;
use App\Models\PersonnelLeave;
use App\Models\PersonnelLeave as ModelsPersonnelLeave;
use App\Models\Tko;
use App\Models\TravelOrder;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessLeaveRefund extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auto:leave-auto-refund';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refund Leave if there is a Dtr or Memo.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Log::info('🔵 Leave Refund SYNC STARTED');

        try {

            $leaves = PersonnelLeave::whereHas('approvals', function ($q) {
                $q->whereIn('status', ['approved', 'auto-approved'])
                ->where('level', 'rd');
            })->get();

            // Log::info('📄 Leaves fetched', [
            //     'count' => $leaves->count()
            // ]);

            foreach ($leaves as $leave) {

                $employeeId = $leave->employee_id;
                $employee = $leave->employeeBy;

                // Log::info('🟡 Processing leave', [
                //     'leave_id' => $leave->id,
                //     'employee_id' => $employeeId
                // ]);

                // refund rate
                $isHalfLeave = $leave->leave_mode === 'half';

                $refundDays = $isHalfLeave ? 0.5 : 1;

                if ($employee && $employee->flexi_type === 'FWA-B') {
                    $refundDays *= 1.25;
                }

                $period = CarbonPeriod::create($leave->start_date, $leave->end_date);

                // existing refunds (DB state)
                $existingRefunds = LeaveRefund::where('employee_id', $employeeId)
                    ->where('leave_id', $leave->id)
                    ->pluck('refund_date')
                    ->toArray();

                $validRefundDates = [];

                foreach ($period as $date) {

                    $dateStr = $date->format('Y-m-d');

                    if (!$this->hasWorkContext($employeeId, $dateStr)) {
                        continue;
                    }

                    // Don't refund half-day leave applications.
                    if ($leave->leave_mode === 'half') {
                        continue;
                    }

                    // mark as valid refund date
                    $validRefundDates[] = $dateStr;

                    // IF NOT EXISTS → CREATE REFUND
                    if (!in_array($dateStr, $existingRefunds)) {

                        $leaveCredit = LeaveCredit::where('employee_id', $employeeId)
                            ->where('leave_type_id', $leave->leave_type_id)
                            ->where('year', Carbon::parse($dateStr)->year)
                            ->first();

                        if (!$leaveCredit) {
                            // Log::warning('❌ No leave credit found', [
                            //     'employee_id' => $employeeId,
                            //     'date' => $dateStr
                            // ]);
                            continue;
                        }

                        $leaveCredit->increment('balance', $refundDays);
                        $leaveCredit->decrement('used', $refundDays);

                        LeaveRefund::create([
                            'employee_id'   => $employeeId,
                            'leave_id'      => $leave->id,
                            'refund_date'   => $dateStr,
                            'days_refunded' => $refundDays,
                            'reason'        => 'DTR / TKO / Memo / S.O override',
                        ]);

                        // Log::info('💰 REFUND CREATED', [
                        //     'leave_id' => $leave->id,
                        //     'date' => $dateStr
                        // ]);
                    }
                }

                // =========================
                // 🔁 REVERSE LOGIC (REMOVE INVALID REFUNDS)
                // =========================

                $refundsToRemove = array_diff($existingRefunds, $validRefundDates);

                foreach ($refundsToRemove as $refundDate) {

                    $refund = LeaveRefund::where('employee_id', $employeeId)
                        ->where('leave_id', $leave->id)
                        ->where('refund_date', $refundDate)
                        ->first();

                    if (!$refund) continue;

                    $leaveCredit = LeaveCredit::where('employee_id', $employeeId)
                        ->where('leave_type_id', $leave->leave_type_id)
                        ->where('year', Carbon::parse($refundDate)->year)
                        ->first();

                    if ($leaveCredit) {

                        $leaveCredit->decrement('balance', $refund->days_refunded);
                        $leaveCredit->increment('used', $refund->days_refunded);

                        // Log::warning('🔁 REFUND REVERSED', [
                        //     'leave_id' => $leave->id,
                        //     'date' => $refundDate,
                        //     'amount' => $refund->days_refunded
                        // ]);
                    }

                    $refund->delete();
                }
            }

            // Log::info('🟢 Leave Refund SYNC FINISHED');
        } catch (\Throwable $e) {

            // Log::error('❌ Leave Refund SYNC FAILED', [
            //     'message' => $e->getMessage(),
            //     'file' => $e->getFile(),
            //     'line' => $e->line ?? null
            // ]);

            throw $e;
        }
    }


    private function hasWorkContext($employeeId, $dateStr)
    {
        return Dtr::where('employee_id', $employeeId)
            ->whereDate('punch_date', $dateStr)
            ->exists()
            || Tko::where('employee_id', $employeeId)
            ->whereDate('date', $dateStr)
            ->whereHas('approvals', fn($q) => $q->where('status', 'approved'))
            ->exists()
            || Memo::whereDate('date_from', '<=', $dateStr)
            ->whereDate('date_to', '>=', $dateStr)
            ->exists()
            || TravelOrder::where('employee_id', $employeeId)
            ->whereDate('travel_departure_date', '<=', $dateStr)
            ->whereDate('travel_return_date', '>=', $dateStr)
            ->exists()
            || Activity::whereHas('employees', function ($q) use ($employeeId) {
                $q->where('activity_employees.employee_id', $employeeId);
            })
            ->whereDate('dateFrom', '<=', $dateStr)
            ->whereDate('dateTo', '>=', $dateStr)
            ->exists();
    }
}
