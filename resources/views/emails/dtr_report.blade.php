<!DOCTYPE html>
<html>

<head>
    <title>DTR Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .center {
            text-align: center;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11px;
        }

        th,
        td {
            border: 1px solid black;
            padding: 4px;
            text-align: center;
        }

        .info-table td {
            border: none !important;
            padding: 2px 0;
        }

        .signature-block {
            margin-top: 40px;
            text-align: center;
        }

        .signature-line {
            display: inline-block;
            border-top: 1px solid black;
            width: 200px;
            margin-top: 30px;
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
            <td><strong>Name:</strong> {{ ucfirst(strtolower($employee->firstname)) }}
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
            </tr>
        </thead>

        <tbody>
            @foreach ($dtrs as $row)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($row['date'])->format('j-M') }}</td>
                    <td>{{ \Carbon\Carbon::parse($row['date'])->format('D') }}</td>

                    @if($row['status'] === 'PRESENT')
                        <td>{{ $row['dtr']->timeIn ? \Carbon\Carbon::parse($row['dtr']->timeIn)->format('h:i A') : '00:00:00' }}
                        </td>
                        <td>{{ $row['dtr']->breakOut ? \Carbon\Carbon::parse($row['dtr']->breakOut)->format('h:i A') : '00:00:00' }}
                        </td>
                        <td>{{ $row['dtr']->breakIn ? \Carbon\Carbon::parse($row['dtr']->breakIn)->format('h:i A') : '00:00:00' }}
                        </td>
                        <td>{{ $row['dtr']->timeOut ? \Carbon\Carbon::parse($row['dtr']->timeOut)->format('h:i A') : '00:00:00' }}
                        </td>
                        <td>{{ $row['dtr']->undertime ? \Carbon\Carbon::createFromFormat('H:i:s', $row['dtr']->tardiness)->format('H:i:s') : '00:00:00' }}
                        <td>{{ $row['dtr']->undertime ? \Carbon\Carbon::createFromFormat('H:i:s', $row['dtr']->undertime)->format('H:i:s') : '00:00:00' }}
                        </td>
                        <td>{{ $row['dtr']->overtime ? \Carbon\Carbon::createFromFormat('H:i:s', $row['dtr']->overtime)->format('H:i:s') : '00:00:00' }}


                    @elseif($row['status'] === 'LEAVE')
                            <td colspan="6">{{ $row['leave_type'] ?? 'ON LEAVE' }}</td>


                        @elseif($row['status'] === 'ACTIVITY')
                        <td colspan="6">Activity: {{ $row['activity'] }} (S.O #: {{ $row['soNumber'] }})</td>


                    @elseif($row['status'] === 'TRAINING')
                        <td colspan="6">Training: {{ $row['title'] }} (S.O #: {{ $row['soNumber'] }})</td>


                    @elseif($row['status'] === 'WEEKEND')
                        <td colspan="6">WEEKEND</td>

                    @else
                        @php
                            $dayOfWeek = \Carbon\Carbon::parse($row['date'])->format('D');
                        @endphp

                        @if($employee->flexi_type === 'FWA-B' && $dayOfWeek === 'Fri')
                            <td colspan="6">{{ $employee->flexi_type }}</td>
                        @else
                            <td colspan="6">ABSENT</td>
                        @endif
                    @endif
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3"><strong>Total Absent:</strong></td>
                <td>{{ $totalAbsent }}</td>
                <td><strong>Total Tardiness:</strong></td>
                <td>{{ $totalTardiness }}</td>
                <td><strong>Total Undertime:</strong></td>
                <td>{{ $totalUndertime }}</td>
            </tr>

            <!-- NEW ROW: Sum of Tardiness + Undertime -->
            <tr>
                <td colspan="6"><strong>Total Tardiness + Undertime:</strong></td>
                <td colspan="2">
                    @php
                        // Convert H:i:s to seconds
                        [$h, $m, $s] = explode(':', $totalTardiness ?? '00:00:00');
                        $tardinessSeconds = ($h * 3600) + ($m * 60) + $s;

                        [$h, $m, $s] = explode(':', $totalUndertime ?? '00:00:00');
                        $undertimeSeconds = ($h * 3600) + ($m * 60) + $s;

                        $sumSeconds = $tardinessSeconds + $undertimeSeconds;

                        // Format back to H:i:s
                        $hours = floor($sumSeconds / 3600);
                        $minutes = floor(($sumSeconds % 3600) / 60);
                        $seconds = $sumSeconds % 60;
                        $totalSum = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
                    @endphp

                    {{ $totalSum }}
                </td>
            </tr>
        </tfoot>
    </table>

    <br><br>

    <!-- CERTIFICATION -->
    <p style="text-align:justify; line-height:1.4;">
        I certify on my honor that the above is a true and correct report of
        the hours of work performed, the record of which was made daily
        at the time of arrival and departure from the office.
    </p>

    <!-- SIGNATURE -->
    <div class="signature-block">
        <div class="signature-line"></div><br>
        Employee Signature
    </div>

    <br><br>

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

    <div class="signature-block">
        <div class="signature-line"></div><br>
        In Charge
    </div>

    @if($sectionChief)
        <div class="signature-block">
            {{ $sectionChief->firstname }} {{ $sectionChief->lastname }}<br>
            <div class="signature-line"></div><br>
            Unit/Section Chief
        </div>
    @endif

    <!-- Division Chief -->
    @if($divisionChief)
        <div class="signature-block" style="margin-top:20px;">
            {{ $divisionChief->firstname }} {{ $divisionChief->lastname }}<br>
            <div class="signature-line"></div><br>
            Division Chief
        </div>
    @endif

    <!-- SYSTEM GENERATED FOOTER -->
    <p style="
    text-align: center; 
    font-size: 10px; 
    color: gray; 
    margin-top: 50px;
">
        **This is a system-generated report**
    </p>


</body>

</html>