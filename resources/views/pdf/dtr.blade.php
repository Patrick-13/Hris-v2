<!DOCTYPE html>
<html>

<head>
    <title>DTR Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
        }

        .center {
            text-align: center;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            font-size: 12px;
        }

        th,
        td {
            border: 1px solid black;
            padding: 2px;
            text-align: center;
        }

        .info-table td {
            border: none !important;
            padding: 2px 0;
        }

        .signature-block {
            margin-top: 14px;
            text-align: center;
        }

        .signature-line {
            display: inline-block;
            border-top: 1px solid black;
            width: 200px;
            margin: 5px auto;
        }
    </style>
</head>

<body>

    <!-- HEADER -->
    <div class="center">
        <div class="title">Environmental Management Bureau XI</div>
        <div style="margin-top:5px;">DAILY TIME RECORD</div>
        <div style="margin-top:3px;">
            Period: {{ \Carbon\Carbon::parse($dateFrom)->format('j-M-Y') }}
            to {{ \Carbon\Carbon::parse($dateTo)->format('j-M-Y') }}
        </div>
    </div>

    <br>

    <!-- PERSONNEL INFO -->
    <table class="info-table">
        <tr>
            <td><strong>Name:</strong> {{ ucwords(strtolower($employee->firstname)) }}
                {{ ucfirst(strtolower($employee->lastname))}}
            </td>
            <td><strong>Position:</strong> {{ $employee->movement?->positionBy?->post_name ?? "No Position Tag" }}</td>
            <td><strong>Payroll No:</strong> {{ $employee->employee_id }}</td>
        </tr>
        <tr>
            <td><strong>Division/Section :</strong>
                {{ $employee->movement?->divisionBy?->div_name ?? "No Division Tag" }} /
                {{ $employee->movement?->sectionBy?->sec_name ?? "No Section Tag" }}
            </td>
            <td><strong>Regular Time:</strong> DEFAULT</td>
            <td><strong>Work Arrangement: </strong>{{ $employee->flexi_type }}</td>
        </tr>
    </table>

    <br>

    <!-- MAIN TABLE -->
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Day</th>
                <th>AM IN</th>
                <th>AM OUT</th>
                <th>PM IN</th>
                <th>PM OUT</th>
                <th>TN</th>
                <th>UT</th>
                <th>OT</th>
                <th>REMARKS</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($dtrs as $row)

            @php
            $dtr = $row['dtr'] ?? null;

            $timeIn = optional($dtr)->timeIn;
            $breakOut = optional($dtr)->breakOut;
            $breakIn = optional($dtr)->breakIn;
            $timeOut = optional($dtr)->timeOut;

            // ✅ CHECKS
            $hasTime =
            !empty($timeIn) ||
            !empty($breakOut) ||
            !empty($breakIn) ||
            !empty($timeOut);
            $hasLeave = $row['status'] === 'LEAVE';
            $isActivity = in_array($row['status'], ['ACTIVITY', 'TRAINING', 'TRAVEL', 'NO WORK']);

            // ✅ FINAL PRIORITY
            if ($hasTime) {
            $finalStatus = 'PRESENT';
            } elseif ($hasLeave) {
            $finalStatus = 'LEAVE';
            } elseif ($isActivity) {
            $finalStatus = $row['status'];
            } else {
            $finalStatus = 'ABSENT';
            }
            @endphp

            <tr>
                <td>{{ \Carbon\Carbon::parse($row['date'])->format('j-M') }}</td>
                <td>{{ \Carbon\Carbon::parse($row['date'])->format('D') }}</td>

                {{-- ================= PRESENT / DTR ================= --}}
                @if($finalStatus === 'PRESENT')

                {{-- Detect HALF DAY --}}
                @php
                $filledLogs = collect([
                $timeIn,
                $breakOut,
                $breakIn,
                $timeOut,
                ])->filter(fn($v) => !empty($v))->count();

                $isHalfDay = $filledLogs > 0 && $filledLogs < 4;
                    @endphp

                    @if($isHalfDay)

                    {{-- FULL DAY WITHOUT BREAK --}}
                    @if(empty($breakIn) && empty($breakOut))
                    <td>{{ $timeIn ? \Carbon\Carbon::parse($timeIn)->format('h:i A') : '—' }}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>{{ $timeOut ? \Carbon\Carbon::parse($timeOut)->format('h:i A') : '—' }}</td>

                    {{-- PM HALF --}}
                    @elseif(empty($timeIn) && empty($breakOut))
                    <td colspan="2"><strong>HALF-DAY (AM)</strong></td>
                    <td>{{ $breakIn ? \Carbon\Carbon::parse($breakIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $timeOut ? \Carbon\Carbon::parse($timeOut)->format('h:i A') : '—' }}</td>

                    {{-- AM HALF --}}
                    @elseif(empty($breakIn) && empty($timeOut))
                    <td>{{ $timeIn ? \Carbon\Carbon::parse($timeIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $breakOut ? \Carbon\Carbon::parse($breakOut)->format('h:i A') : '—' }}</td>
                    <td colspan="2"><strong>HALF-DAY (PM)</strong></td>

                    @else
                    <td>{{ $timeIn ? \Carbon\Carbon::parse($timeIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $breakOut ? \Carbon\Carbon::parse($breakOut)->format('h:i A') : '—' }}</td>
                    <td>{{ $breakIn ? \Carbon\Carbon::parse($breakIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $timeOut ? \Carbon\Carbon::parse($timeOut)->format('h:i A') : '—' }}</td>
                    @endif

                    @else
                    {{-- NORMAL FULL DAY --}}
                    <td>{{ $timeIn ? \Carbon\Carbon::parse($timeIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $breakOut ? \Carbon\Carbon::parse($breakOut)->format('h:i A') : '—' }}</td>
                    <td>{{ $breakIn ? \Carbon\Carbon::parse($breakIn)->format('h:i A') : '—' }}</td>
                    <td>{{ $timeOut ? \Carbon\Carbon::parse($timeOut)->format('h:i A') : '—' }}</td>
                    @endif

                    {{-- UT & OT --}}
                    <td>{{ $row['dtr']->tardiness ? \Carbon\Carbon::createFromFormat('H:i:s', $row['dtr']->tardiness)->format('H:i:s') : '00:00:00' }}
                    <td>{{ optional($dtr)->undertime ? \Carbon\Carbon::createFromFormat('H:i:s', $dtr->undertime)->format('H:i:s') : '00:00:00' }}
                    </td>
                    <td>{{ optional($dtr)->overtime ? \Carbon\Carbon::createFromFormat('H:i:s', $dtr->overtime)->format('H:i:s') : '00:00:00' }}
                    </td>

                    {{-- ================= LEAVE ================= --}}
                    @elseif($finalStatus === 'LEAVE')
                    <td colspan="7">{{ $row['leave_type'] ?? 'ON LEAVE' }}</td>

                    {{-- ================= ACTIVITY ================= --}}
                    @elseif($finalStatus === 'ACTIVITY')
                    <td colspan="7">Activity: {{ $row['activity'] }} (S.O #: {{ $row['soNumber'] }})</td>

                    {{-- ================= TRAINING ================= --}}
                    @elseif($finalStatus === 'TRAINING')
                    <td colspan="7">Training: {{ $row['title'] }} (S.O #: {{ $row['soNumber'] }})</td>

                    {{-- ================= TRAVEL ================= --}}
                    @elseif($finalStatus === 'TRAVEL')
                    <td colspan="7">
                        Travel No: {{ $row['travel_id'] ?? '—' }}
                    </td>

                    {{-- ================= WEEKEND ================= --}}
                    @elseif($row['status'] === 'WEEKEND')
                    <td colspan="7">WEEKEND</td>

                    {{-- ================= HOLIDAY ================= --}}
                    @elseif($row['status'] === 'HOLIDAY')
                    <td colspan="7">HOLIDAY: {{ $row['holiday_name'] }}</td>

                    {{-- ================= MANUAL MEMO / NO WORK ================= --}}
                    @elseif($finalStatus === 'NO WORK')
                    <td colspan="7">
                        {{ $row['memo'] ?? 'NO WORK' }}
                    </td>

                    {{-- ================= ABSENT ================= --}}
                    @else
                    @php
                    $dayOfWeek = \Carbon\Carbon::parse($row['date'])->format('D');
                    @endphp

                    @if($dayOfWeek === 'Fri')
                    <td colspan="7">NO WORK</td>
                    @else
                    <td colspan="7">ABSENT</td>
                    @endif
                    @endif
                    <td>
                        @php
                        $remarks = [];
                        $dayOfWeek = \Carbon\Carbon::parse($row['date'])->format('D');

                        if (!empty($row['travel_id'])) {
                        $remarks[] = 'T.O #' . $row['travel_id'];
                        }

                        if (!empty($row['soNumber'])) {
                        $remarks[] = 'S.O #' . $row['soNumber'];
                        }

                        if (!empty($row['soNumberTraining'])) {
                        $remarks[] = ' T.S.O #' . $row['soNumberTraining'];
                        }

                        if (!empty($row['memoNumber'])) {
                        $remarks[] = 'Memo #: ' . $row['memoNumber'];
                        }

                        if (!empty($row['tkoType'])) {
                        $remarks[] = 'TKO - ' . $row['tkoType'] . ': ' . $row['tkoTime'];
                        }

                        if (!empty($row['leave'])) {
                        $remarks[] = 'Leave';
                        }

                        if($hasTime && $dayOfWeek === 'Fri'){
                        $remarks[] = 'OT';
                        }
                        @endphp

                        <small>
                            {{ !empty($remarks) ? implode(' | ', $remarks) : '—' }}
                        </small>
                    </td>
            </tr>


            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6"><strong>Total Absent: {{ $totalAbsent }}</strong></td>
                <td>{{ $totalTardiness }}</td>
                <td>{{ $totalUndertime }}</td>
                <td>{{ $totalOvertime }}</td>
                <td>—</td>
            </tr>

            <!-- NEW ROW: Sum of Tardiness + Undertime -->
            <tr>
                <td colspan="10"><strong>Total Tardiness + Undertime: @php
                        // Convert tardiness to seconds
                        [$h, $m, $s] = explode(':', $totalTardiness ?? '00:00:00');
                        $tardinessSeconds = ($h * 3600) + ($m * 60) + $s;

                        // Convert undertime to seconds
                        [$h, $m, $s] = explode(':', $totalUndertime ?? '00:00:00');
                        $undertimeSeconds = ($h * 3600) + ($m * 60) + $s;

                        // Sum total seconds
                        $sumSeconds = $tardinessSeconds + $undertimeSeconds;

                        // ✅ Convert to total minutes
                        $totalMinutes = floor($sumSeconds / 60);
                        @endphp

                        {{ $totalMinutes }}</strong></td>

            </tr>
        </tfoot>
    </table>
    <!-- CERTIFICATION -->
    <p style="text-align:justify; line-height:1.4;">
        I certify on my honor that the above is a true and correct report of
        the hours of work performed, the record of which was made daily
        at the time of arrival and departure from the office.
    </p>

    <!-- SIGNATURE -->
    <div class="signature-block">
        {{ strtoupper($employee->firstname) }}
        {{ strtoupper(substr($employee->middlename, 0, 1)) . '.' }}
        {{ strtoupper($employee->lastname)}}<br>
        <div class="signature-line"></div><br>
        Employee Signature
    </div>

    <br>

    <p style="
    text-align:center; 
    line-height:1.4;
    border-top:1px solid black;
    width:700px;
    margin:0 auto 5px auto;
    padding-top:5px;
">
        <b>VERIFIED as to prescribed office hours</b>
    </p>
    <br>
    @if(!$isDivisionChiefDtr && !$isSectionChiefDtr && !$isSecretary && $sectionChief)

    <div class="signature-block">
        {{ strtoupper($sectionChief->firstname) }}
        {{ strtoupper(substr($sectionChief->middlename, 0, 1)) . '.' }}
        {{ strtoupper($sectionChief->lastname)}}<br>

        <div class="signature-line"></div><br>
        Unit/Section Chief
    </div>

    @endif
    <br><br>

    <!-- Division Chief -->
    @if($isDivisionChiefDtr)
    <div class="signature-block" style="margin-top:10px;">
        EnP {{ strtoupper($regionalDirector->firstname) }}
        {{ strtoupper(substr($regionalDirector->middlename, 0, 1)) . '.' }}
        {{ strtoupper($regionalDirector->lastname) }}<br>
        <div class="signature-line"></div><br>
        Regional Director
    </div>
    @elseif($divisionChief)
    <div class="signature-block" style="margin-top:10px;">
        @if($divisionChief->employee_id === '0159')
        EnP
        @elseif(in_array($divisionChief->employee_id, ['0119', '0084', '0103']))
        ENGR.
        @endif
        {{ strtoupper($divisionChief->firstname) }}
        {{ strtoupper(substr($divisionChief->middlename, 0, 1)) . '.' }}
        {{ strtoupper($divisionChief->lastname) }}<br>
        <div class="signature-line"></div><br>
        {{ $divisionChief->employee_id === '0159' ? 'Regional Director' : 'Division Chief' }}
    </div>

    @endif

    <!-- SYSTEM GENERATED FOOTER -->
    <p style="
    text-align: center; 
    font-size: 10px; 
    color: gray; 
    margin-top: 30px;
">
        **This is a system-generated report**
    </p>


</body>

</html>