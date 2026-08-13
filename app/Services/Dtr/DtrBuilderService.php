<?php

namespace App\Services\Dtr;

use App\DTOs\DtrContext;
use App\Repositories\Dtr\ActivityRepository;
use App\Repositories\Dtr\DtrRepository;
use App\Repositories\Dtr\EmployeeRepository;
use App\Repositories\Dtr\HolidayRepository;
use App\Repositories\Dtr\LeaveRepository;
use App\Repositories\Dtr\TrainingRepository;
use App\Repositories\Dtr\TravelOrderRepository;

class DtrBuilderService
{
    public function __construct(
        protected LeaveRepository $leaveRepo,
        protected ActivityRepository $activityRepo,
        protected TrainingRepository $trainingRepo,
        protected TravelOrderRepository $travelRepo,
        protected HolidayRepository $holidayRepo,
        protected DtrRepository $dtrRepo,
        protected EmployeeRepository $employeeRepo,
        protected DtrStatusResolver $statusResolver,
    ) {}

    public function build($employeeId, $dateFrom, $dateTo)
    {
        $employee = $this->employeeRepo->findByEmployeeId($employeeId);

        $data = [
            'dtrs'       => $this->dtrRepo->getByRange($employeeId, $dateFrom, $dateTo),
            'leaves'     => $this->leaveRepo->getByEmployeeAndRange($employeeId, $dateFrom, $dateTo),
            'activities' => $this->activityRepo->getByEmployeeAndRange($employeeId, $dateFrom, $dateTo),
            'trainings'  => $this->trainingRepo->getByEmployeeAndRange($employeeId, $dateFrom, $dateTo),
            'travel'     => $this->travelRepo->getByEmployeeAndRange($employee->iis_employee_id, $dateFrom, $dateTo),
            'holidays'   => $this->holidayRepo->getByRange($dateFrom, $dateTo),
        ];

        $context = new DtrContext(
            dtrs: $data['dtrs'],
            leaves: $data['leaves'],
            activities: $data['activities'],
            trainings: $data['trainings'],
            travel: $data['travel'],
            holidays: $data['holidays'],
        );

        return $this->buildTimeline($employee, $context, $dateFrom, $dateTo);
    }

    private function buildTimeline($employee, $data, $dateFrom, $dateTo)
    {
        $period = \Carbon\CarbonPeriod::create($dateFrom, $dateTo);
        $result = [];

        foreach ($period as $date) {
            $result[] = $this->statusResolver->resolve(
                $employee,
                $date,
                $data
            );
        }

        return $result;
    }
}
