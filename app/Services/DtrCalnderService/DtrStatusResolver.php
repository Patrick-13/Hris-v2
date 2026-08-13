<?php

namespace App\Services\DtrCalnderService;


class DtrStatusResolver
{
    public function resolve(DtrDayContext $context): array
    {
        if ($context->dtr) {
            return $this->present($context);
        }

        if ($context->leave) {
            return $this->leave($context);
        }

        if ($context->holiday) {
            return $this->holiday($context);
        }

        if ($context->memo) {
            return $this->memo($context);
        }

        if (
            $context->travel &&
            !$context->date->isWeekend()
        ) {
            return $this->travel($context);
        }

        if ($context->activity) {
            return $this->activity($context);
        }

        if ($context->training) {
            return $this->training($context);
        }

        if ($context->isFriday()) {
            return $this->fwaB($context);
        }

        if ($context->isWeekend()) {
            return $this->weekend($context);
        }

        return $this->absent($context);
    }

    private function present(
        DtrDayContext $context
    ): array {
        $dtr = $context->dtr;

        $timeOut = $context->tko
            ? $context->tko->tko_time
            : $dtr->timeOut;

        $halfDay =
            (
                (!$dtr->timeIn && !$dtr->breakOut) ||
                (!$dtr->breakIn && !$timeOut)
            )
            && !$context->isExcused();

        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => $halfDay
                ? 'HALF-DAY'
                : 'PRESENT',
            'dtr' => $dtr,
            'leave' => $context->leave,
            'is_excused' => $context->isExcused(),

            'travel_id' => $context->travel?->travel_id,
            'destination' => $context->travel?->travel_destination,
            'purpose' => $context->travel?->travel_purpose,

            'soNumber' => $context->activity?->soNumber,
            'activity' => $context->activity?->activityTypeBy?->name,

            'soNumberTraining' => $context->training?->soNumber,
            'title' => $context->training?->title,

            'memoNumber' => data_get(
                $context->memo,
                'memo_number'
            ),

            'memoStatus' => data_get(
                $context->memo,
                'status'
            ),

            'tkoType' => $context->tko?->tko_type,
            'tkoTime' => $context->tko?->tko_time,
        ];
    }

    private function leave(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'LEAVE',
            'leave_type' => $context->leave->leaveType?->name,
            'leave_id' => $context->leave->id,
        ];
    }

    private function holiday(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'HOLIDAY',
            'holiday_name' => $context->holiday->name,
            'holiday_type' => $context->holiday->type,
        ];
    }

    private function memo(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'NO WORK',
            'memo' => $context->memo->title,
            'memo_type' => 'LGU MEMO',
        ];
    }

    private function travel(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'TRAVEL',
            'travel_id' => $context->travel->travel_id,
            'destination' => $context->travel->travel_destination,
            'purpose' => $context->travel->travel_purpose,
        ];
    }

    private function activity(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'ACTIVITY',
            'soNumber' => $context->activity->soNumber,
            'activity' => $context->activity->activityTypeBy?->name,
        ];
    }

    private function training(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'TRAINING',
            'soNumber' => $context->training->soNumber,
            'title' => $context->training->title,
        ];
    }

    private function fwaB(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'FWA-B',
        ];
    }

    private function weekend(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'WEEKEND',
        ];
    }

    private function absent(DtrDayContext $context): array
    {
        return [
            'date' => $context->date->format('Y-m-d'),
            'status' => 'ABSENT',
        ];
    }
}
