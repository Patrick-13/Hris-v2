<?php

namespace App\Services\DtrCalnderService;

use App\Models\Activity;
use App\Models\Dtr;
use App\Models\Holiday;
use App\Models\Memo;
use App\Models\PersonnelEmployee;
use App\Models\PersonnelLeave;
use App\Models\PersonnelTraining;
use App\Models\Tko;
use App\Models\TravelOrder;
use Carbon\Carbon;
use App\DTOs\DtrContext;

class DtrCalendarDataLoader
{
    public function load(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ): DtrContext {
        $employee = PersonnelEmployee::where(
            'employee_id',
            $employeeId
        )->firstOrFail();

        return new DtrContext(
            employee: $employee,

            dtrs: $this->loadDtrs(
                $employeeId,
                $dateFrom,
                $dateTo
            ),

            leaves: $this->loadLeaves(
                $employeeId,
                $dateFrom,
                $dateTo
            ),

            activities: $this->loadActivities(
                $employeeId,
                $dateFrom,
                $dateTo
            ),

            trainings: $this->loadTrainings(
                $employeeId,
                $dateFrom,
                $dateTo
            ),

            travelOrders: $this->loadTravelOrders(
                $employee,
                $dateFrom,
                $dateTo
            ),

            holidays: $this->loadHolidays(
                $dateFrom,
                $dateTo
            ),

            memos: $this->loadMemos(
                $dateFrom,
                $dateTo
            ),

            tkos: $this->loadTkos(
                $employeeId,
                $dateFrom,
                $dateTo
            ),
        );
    }

    private function loadDtrs(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ) {
        return Dtr::where('employee_id', $employeeId)
            ->whereBetween('punch_date', [
                $dateFrom,
                $dateTo
            ])
            ->get()
            ->keyBy(
                fn($dtr) =>
                Carbon::parse($dtr->punch_date)
                    ->format('Y-m-d')
            );
    }

    private function loadLeaves(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ) {
        return PersonnelLeave::where(
            'employee_id',
            $employeeId
        )
            ->where(function ($query) use (
                $dateFrom,
                $dateTo
            ) {
                $query
                    ->whereBetween(
                        'start_date',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhereBetween(
                        'end_date',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhere(function ($query) use (
                        $dateFrom,
                        $dateTo
                    ) {
                        $query
                            ->where(
                                'start_date',
                                '<=',
                                $dateFrom
                            )
                            ->where(
                                'end_date',
                                '>=',
                                $dateTo
                            );
                    });
            })
            ->with([
                'approvals',
                'leaveType',
            ])
            ->get();
    }

    private function loadActivities(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ) {
        return Activity::whereHas(
            'employees',
            function ($query) use ($employeeId) {
                $query->where(
                    'activity_employees.employee_id',
                    $employeeId
                );
            }
        )
            ->where(function ($query) use (
                $dateFrom,
                $dateTo
            ) {
                $query
                    ->whereBetween(
                        'dateFrom',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhereBetween(
                        'dateTo',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhere(function ($query) use (
                        $dateFrom,
                        $dateTo
                    ) {
                        $query
                            ->where(
                                'dateFrom',
                                '<=',
                                $dateFrom
                            )
                            ->where(
                                'dateTo',
                                '>=',
                                $dateTo
                            );
                    });
            })
            ->with('activityTypeBy')
            ->get();
    }

    private function loadTrainings(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ) {
        return PersonnelTraining::whereHas(
            'employees',
            function ($query) use ($employeeId) {
                $query->where(
                    'training_employees.employee_id',
                    $employeeId
                );
            }
        )
            ->where(function ($query) use (
                $dateFrom,
                $dateTo
            ) {
                $query
                    ->whereBetween(
                        'dateFrom',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhereBetween(
                        'dateTo',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhere(function ($query) use (
                        $dateFrom,
                        $dateTo
                    ) {
                        $query
                            ->where(
                                'dateFrom',
                                '<=',
                                $dateFrom
                            )
                            ->where(
                                'dateTo',
                                '>=',
                                $dateTo
                            );
                    });
            })
            ->get();
    }

    private function loadHolidays(
        string $dateFrom,
        string $dateTo
    ) {
        return Holiday::whereBetween(
            'holiday_date',
            [$dateFrom, $dateTo]
        )
            ->get()
            ->keyBy(
                fn($holiday) =>
                Carbon::parse($holiday->holiday_date)
                    ->format('Y-m-d')
            );
    }

    private function loadMemos(
        string $dateFrom,
        string $dateTo
    ) {
        return Memo::where(
            'date_from',
            '<=',
            $dateTo
        )
            ->where(
                'date_to',
                '>=',
                $dateFrom
            )
            ->get();
    }

    private function loadTkos(
        string $employeeId,
        string $dateFrom,
        string $dateTo
    ) {
        return Tko::where(
            'employee_id',
            $employeeId
        )
            ->whereBetween(
                'date',
                [$dateFrom, $dateTo]
            )
            ->with('approvals')
            ->get()
            ->groupBy(
                fn($tko) => $tko->date
            );
    }

    private function loadTravelOrders(
        PersonnelEmployee $employee,
        string $dateFrom,
        string $dateTo
    ) {
        return TravelOrder::where(
            'employee_id',
            $employee->iis_employee_id
        )
            ->where(function ($query) use (
                $dateFrom,
                $dateTo
            ) {
                $query
                    ->whereBetween(
                        'travel_departure_date',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhereBetween(
                        'travel_return_date',
                        [$dateFrom, $dateTo]
                    )
                    ->orWhere(function ($query) use (
                        $dateFrom,
                        $dateTo
                    ) {
                        $query
                            ->where(
                                'travel_departure_date',
                                '<=',
                                $dateFrom
                            )
                            ->where(
                                'travel_return_date',
                                '>=',
                                $dateTo
                            );
                    });
            })
            ->get();
    }
}
