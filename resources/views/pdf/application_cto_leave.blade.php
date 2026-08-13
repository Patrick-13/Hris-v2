<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Certificate of COC Earned</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 25px 40px;
        }

        .border-box {
            border: 1px solid #000;
            padding: 15px 25px;
            margin-bottom: 15px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .underline {
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }

        .long-line {
            display: inline-block;
            min-width: 150px;
            text-align: center;
        }

        .flex {
            display: flex;
            justify-content: space-between;
        }

        .signature {
            height: 50px;
            display: block;
            margin: 0 auto -15px auto;
            /* Pull the name upward */
        }

        .sign-name {
            position: relative;
            z-index: 1;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }

        th {
            font-weight: bold;
        }

        .sign-section {
            display: table;
            width: 100%;
            margin-top: 25px;
            text-align: center;
        }

        .sign-block {
            display: table-cell;
            width: 50%;
            text-align: center;
            vertical-align: top;
        }


        .logo {
            width: 70px;
            margin-top: 5px;
        }

        .sign-dates {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            padding: 0 50px;
        }

        .footer {
            text-align: right;
            font-size: 9px;
            margin-top: 5px;
        }

        .annex {
            text-align: right;
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>
    <div class="annex">Annex A</div>

    <!-- 🟩 TOP CERTIFICATE BOX -->
    <div class="border-box" style="margin-top: 5px;">
        <h3 class="text-center" style="margin: 0; border: 3px solid #000; padding: 6px;">Certificate of COC Earned</h3>

        <p style="margin-top: 20px; text-align: center;">
            This certificate entitles Mr. / Ms.
            <strong><span class="underline">{{ strtoupper($employee_name) }}</span></strong>
            to
            <br><br>
            <strong><span class="underline long-line">{{ $hours }} hours</span></strong> of Compensatory Overtime
            Credits.
        </p>

        <p style="margin-top: -2px; margin-left: 140px;">(number of hours)</p>

        <p class="text-center" style="margin-top: 5px;">
            {{ $earned_date }} {{ $reference_no }}
        </p>
        <div class="sign-section" style="display: table; width: 100%; margin-top: 25px; text-align: right;">
            <div class="sign-block" style="display: table-cell; width: 50%; text-align: center; vertical-align: top;">
                <img src="{{ public_path('signatures/alvarez.png') }}" class="signature" alt="Alvarez Signature">
                <div class="sign-name">
                    <strong><span class="underline long-line">EnP ALNULFO M. ALVAREZ</span></strong>
                </div>
                Regional Director<br><br>
            </div>
        </div>

        <div class="flex" style="margin-top: 20px;">
            <p><strong>Date Issued:</strong> {{ $date_issued }}</p>
            <p><strong>Valid Until:</strong> {{ $valid_until }}</p>
        </div>
    </div>

    <!-- 🟦 LOWER TABLE + SIGNATURE SECTION -->
    <div class="border-box">
        <table>
            <thead>
                <tr>
                    <th>No. of Hours of Earned</th>
                    <th>Date of CTO</th>
                    <th>Used COCs</th>
                    <th>Remaining COCs</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>COCs/ Beginning Balance</td>
                    <td>{{ $date_issued }}</td>
                    <td>{{ $hours }} hrs</td>
                    <td>{{ number_format($balance * 8, 2) }} hrs</td>
                    <td>None</td>
                </tr>
            </tbody>
        </table>

        <!-- ✅ Signature Section -->
        <div class="sign-section" style="display: table; width: 100%; margin-top: 25px; text-align: center;">
            <!-- Approved by -->
            <div class="sign-block" style="display: table-cell; width: 50%; text-align: center; vertical-align: top;">
                <p><strong>Approved by:</strong></p>
                <img src="{{ public_path('signatures/alvarez.png') }}" class="signature" alt="Alvarez Signature">
                <div class="sign-name">
                    <strong><span class="underline long-line">EnP ALNULFO M. ALVAREZ</span></strong><br>
                    Regional Director
                </div>
            </div>

            <!-- Claimed -->
            <div class="sign-block" style="display: table-cell; width: 50%; text-align: center; vertical-align: top;">
                <p><strong>Claimed:</strong></p>
                <img src="{{ public_path('signatures/geli.png') }}" class="signature" alt="Geli Signature">
                <div class="sign-name">
                    <strong><span class="underline long-line">JILMA MAE E. GELI</span></strong><br>
                    HRMO
                </div>
            </div>
        </div>
        <div class="footer">
            <small>{{ $control_no }}</small>
        </div>

</body>

</html>