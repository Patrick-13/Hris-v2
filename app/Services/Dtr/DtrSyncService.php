<?php

namespace App\Services\Dtr;

use App\Models\Dtr;
use App\Models\IclockTransaction;
use App\Models\PersonnelEmployee;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class DtrSyncService
{
    public function __construct(
        protected DtrPunchService $punchService,
        protected DtrCalculationService $calculation
    ) {}

    public function sync(): void
    {
        $punches = $this->getPunches();

        foreach ($punches as $dayPunches) {
            $this->processDay($dayPunches);
        }
    }

    private function getPunches()
    {
        return IclockTransaction::where('is_attendance', 1)
            ->orderBy('punch_time')
            ->get()
            ->groupBy(function ($item) {
                return $item->emp_code . '_' .
                    Carbon::parse($item->punch_time)->toDateString();
            });
    }

    private function processDay($dayPunches): void
    {
        $transaction = $dayPunches->first();

        $employee = $this->findEmployee($transaction);

        if (!$employee) {
            return;
        }

        $punchDate = Carbon::parse(
            $transaction->punch_time
        )->toDateString();

        $dtr = $this->getOrCreateDtr(
            $employee,
            $punchDate
        );

        $this->punchService->process(
            $dtr,
            $dayPunches
        );

        $this->calculation->calculate($dtr);
    }

    private function findEmployee(
        IclockTransaction $transaction
    ): ?PersonnelEmployee {
        $device = $transaction->employee_transaction;

        if (!$device) {
            Log::warning(
                "No mapping for emp_code {$transaction->emp_code}"
            );

            return null;
        }

        $employee = PersonnelEmployee::where(
            'employee_id',
            $device->employee_id
        )->first();

        if (!$employee) {
            throw new Exception(
                "Employee not found: {$device->employee_id}"
            );
        }

        return $employee;
    }

    private function getOrCreateDtr(
        PersonnelEmployee $employee,
        string $date
    ): Dtr {
        return Dtr::firstOrCreate(
            [
                'employee_id' => $employee->employee_id,
                'punch_date'  => $date,
            ],
            [
                'flexi_type' => $employee->flexi_type,
            ]
        );
    }
}
