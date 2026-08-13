<?php

namespace App\Services;

use App\Models\Dtr;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DtrFlexiScheduleService
{
    /**
     * Calculate expected time out based on flexi type.
     */
    public function expectedOut(Dtr $dtr): ?Carbon
    {
        if (!$dtr->timeIn || !$dtr->flexi_type) return null;

        $config = config('flexi.' . $dtr->flexi_type);
        if (!$config) return null;

        $actualIn = $this->dt($dtr, $dtr->timeIn);
        if (!$actualIn) return null;

        $flexEnd = $this->dateTime($dtr, $config['shift_end']);

        // 🔹 Sliding (FWB)
        if ($config['type'] === 'sliding') {
            $hours = $config['required_work_hours'] + $config['lunch_break_hours'];
            $expected = $actualIn->copy()->addHours($hours);
            return $expected->gt($flexEnd) ? $flexEnd : $expected;
        }

        // 🔹 Fixed (FWA)
        if ($config['type'] === 'fixed') {
            $actualTime = $actualIn->format('H:i');

            // Sort pairs by start time to make sure comparison works correctly
            $pairs = $config['pairs'];
            ksort($pairs);

            $selectedOut = null;

            foreach ($pairs as $in => $out) {
                if ($actualTime >= $in) {
                    $selectedOut = $out; // candidate
                }
            }

            // If no pair matched (clocked in earlier than first), pick earliest out
            if (! $selectedOut) {
                $selectedOut = reset($pairs); // first out
            }

            return $this->dateTime($dtr, $selectedOut);
        }


        return null;
    }

    /**
     * Calculate tardiness in H:i:s
     */
    public function tardiness(Dtr $dtr): string
    {
        if (!$dtr->timeIn || !$dtr->flexi_type) return '00:00:00';

        $config = config('flexi.' . $dtr->flexi_type);

        if (!$config) return '00:00:00';

        $actualIn = $this->dt($dtr, $dtr->timeIn);
        if (!$actualIn) return '00:00:00';

        // ✅ HALF-DAY RULE (12:00 PM – 1:00 PM)
        if ($actualIn->between(
            $actualIn->copy()->setTime(12, 0),
            $actualIn->copy()->setTime(13, 0),
            true // inclusive
        )) {
            return '00:00:00';
        }

        $baseline = null;

        if ($dtr->flexi_type === 'FWA-A') {

            if ($actualIn->isMonday()) {

                $baseline = $this->dateTime($dtr, '08:00');
            } else {

                if ($config['type'] === 'sliding') {
                    $baseline = $this->dateTime($dtr, $config['tardiness_start']);
                }
                // 🔹 Fixed FWA-A schedule
                elseif ($config['type'] === 'fixed') {
                    $baseline = $this->dateTime($dtr, $config['tardiness_start']); // 09:00
                }
            }
        } elseif ($config['type'] === 'sliding') {

            $baseline = $this->dateTime(
                $dtr,
                $config['tardiness_start']
            );
        }

        if (!$baseline) {
            return '00:00:00';
        }

        if ($actualIn->lte($baseline)) {
            return '00:00:00';
        }

        $seconds = $baseline->diffInSeconds($actualIn);

        $result = $this->formatSeconds($seconds);


        return $result;
    }

    public function afternoonTardiness(Dtr $dtr): string
    {
        if (!$dtr->breakIn || !$dtr->flexi_type) {
            return '00:00:00';
        }

        $config = config('flexi.' . $dtr->flexi_type);

        if (!$config) {
            return '00:00:00';
        }

        $actualBreakIn = $this->dt($dtr, $dtr->breakIn);

        if (!$actualBreakIn) {
            return '00:00:00';
        }

        $baseline = $this->dateTime(
            $dtr,
            $config['afternoon_tardiness_start']
        );

        if ($actualBreakIn->lte($baseline)) {
            return '00:00:00';
        }

        return $this->formatSeconds(
            $baseline->diffInSeconds($actualBreakIn)
        );
    }


    /**
     * Calculate undertime in H:i:s
     */
    public function undertime(Dtr $dtr): string
    {
        if (!$dtr->timeIn || !$dtr->timeOut) {
            return '00:00:00';
        }
        $actualIn = $this->dt($dtr, $dtr->timeIn);
        $actualOut = $this->dt($dtr, $dtr->timeOut);

        if (!$actualIn || !$actualOut) {
            return '00:00:00';
        }

        $config = config('flexi.' . $dtr->flexi_type);

        if (!$config) {
            return '00:00:00';
        }

        //half-day rule
        if ($actualIn->between(
            $actualIn->copy()->setTime(12, 0),
            $actualIn->copy()->setTime(13, 0),
            true
        )) {
            $expectedOut = $actualIn->copy()->setTime(17, 0);

            if ($actualOut->gte($expectedOut)) {
                return '00:00:00';
            }

            return $this->formatSeconds(
                $actualOut->diffInSeconds($expectedOut)
            );
        }

        if ($dtr->flexi_type === 'FWA-A' && $actualIn->isMonday()) {
            $expectedOut = $this->dateTime($dtr, '17:00');
        } else {
            // 🔹 Determine expected out based on flexi type
            if ($config['type'] === 'sliding') {
                $hours = $config['required_work_hours'] + $config['lunch_break_hours'];
                $expectedOut = $actualIn->copy()->addHours($hours);

                // Cap to shift_end if actualIn + hours > shift_end
                $shiftEnd = $this->dateTime($dtr, $config['shift_end']);
                if ($expectedOut->gt($shiftEnd)) {
                    $expectedOut = $shiftEnd;
                }
            } elseif ($config['type'] === 'fixed') {
                $pairs = $config['pairs'];
                ksort($pairs);

                $shiftEndTime = null;

                foreach ($pairs as $in => $out) {
                    if ($actualIn->format('H:i') >= $in) {
                        $shiftEndTime = $out;
                    }
                }

                // Fallback to earliest pair
                if (!$shiftEndTime) {
                    $shiftEndTime = reset($pairs);
                }

                $expectedOut = $this->dateTime($dtr, $shiftEndTime);
            }
        }

        if ($actualOut->gte($expectedOut)) return '00:00:00';

        return $this->formatSeconds($actualOut->diffInSeconds($expectedOut));
    }


    public function overtime(Dtr $dtr): string
    {
        if (!$dtr->timeIn || !$dtr->timeOut || !$dtr->flexi_type) {
            return '00:00:00';
        }

        $actualIn  = $this->dt($dtr, $dtr->timeIn);
        $actualOut = $this->dt($dtr, $dtr->timeOut);

        if ($actualOut->lte($actualIn)) {
            return '00:00:00';
        }

        // 🔹 Determine baseline start
        $baselineStart = $this->dateTime($dtr, '07:00');

        // Work starts no earlier than 07:00
        $workStart = $actualIn->max($baselineStart);

        // 🔹 Raw worked seconds
        $workedSeconds = $workStart->diffInSeconds($actualOut);

        // 🔹 Subtract lunch if overlap (12:00–13:00)
        $lunchStart = $this->dateTime($dtr, '12:00');
        $lunchEnd   = $lunchStart->copy()->addHour();

        if ($workStart->lt($lunchEnd) && $actualOut->gt($lunchStart)) {
            $overlapStart = $workStart->gt($lunchStart) ? $workStart : $lunchStart;
            $overlapEnd   = $actualOut->lt($lunchEnd) ? $actualOut : $lunchEnd;
            $workedSeconds -= $overlapStart->diffInSeconds($overlapEnd);
        }

        // 🔹 Required work hours based on flex type
        $config = config('flexi.' . $dtr->flexi_type);
        $requiredHours = $config['type'] === 'FWA-B' ? 10 : 8; // default fallback
        if (!empty($config['required_work_hours'])) {
            $requiredHours = $config['required_work_hours'];
        }

        $requiredSeconds = $requiredHours * 3600;

        // 🔹 OT = anything beyond required seconds
        if ($workedSeconds <= $requiredSeconds) {
            return '00:00:00';
        }

        return $this->formatSeconds($workedSeconds - $requiredSeconds);
    }




    // public function totalHours(Dtr $dtr): string
    // {
    //     if (!$dtr->timeIn || !$dtr->timeOut || !$dtr->flexi_type) {
    //         return '00:00:00';
    //     }

    //     $config = config('flexi.' . $dtr->flexi_type);
    //     if (!$config) return '00:00:00';

    //     $actualIn  = $this->dt($dtr, $dtr->timeIn);
    //     $actualOut = $this->dt($dtr, $dtr->timeOut);

    //     if (!$actualIn || !$actualOut) {
    //         return '00:00:00';
    //     }

    //     // 🔹 Get required work hours
    //     $requiredHours = $config['required_work_hours'] ?? 8;
    //     $requiredSeconds = $requiredHours * 3600;

    //     // 🔹 Compute tardiness seconds
    //     $tardiness = $this->tardiness($dtr);
    //     [$h, $m, $s] = explode(':', $tardiness);
    //     $tardinessSeconds = ($h * 3600) + ($m * 60) + $s;

    //     $undertime = $this->undertime($dtr);
    //     [$h, $m, $s] = explode(':', $undertime);
    //     $undertimeSeconds = ($h * 3600) + ($m * 60) + $s;

    //     // 🔹 Deduct tardiness from required hours
    //     $creditedSeconds = $requiredSeconds - ($tardinessSeconds +  $undertimeSeconds);

    //     if ($creditedSeconds < 0) {
    //         $creditedSeconds = 0;
    //     }

    //     return $this->formatSeconds($creditedSeconds);
    // }




    /* =======================
       Helpers
       ======================= */

    private function dt(Dtr $dtr, ?string $time): ?Carbon
    {
        if (!$time) return null;
        return Carbon::parse($dtr->punch_date->format('Y-m-d') . ' ' . $time);
    }

    private function dateTime(Dtr $dtr, string $time): Carbon
    {
        return Carbon::parse($dtr->punch_date->format('Y-m-d') . ' ' . $time);
    }

    private function formatSeconds(int $seconds): string
    {
        $hours   = intdiv($seconds, 3600);
        $minutes = intdiv($seconds % 3600, 60);
        $secs    = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
    }
}
