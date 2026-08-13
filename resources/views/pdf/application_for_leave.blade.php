<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Application for Leave</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            margin: 15px;
        }

        h3 {
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 0;
            font-size: 25px;
        }

        .underline {
            font-weight: bold;
            border-bottom: 1px solid #000;
        }

        .long-line {
            display: inline-block;
            min-width: 150px;
            text-align: center;
        }

        .signature-cell {
            text-align: center;
            padding-top: 10px;
        }

        .signature-cell-applicant {
            text-align: center;
            padding-top: 1px;
        }

        .sign-block {
            text-align: center;
        }

        .signature-img {
            height: 60px;
            display: block;
            margin: 0 auto -18px auto;
        }

        .sign-name {
            position: relative;
        }

        p.date {
            text-align: right;
            margin-top: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        td,
        th {
            border: 1px solid #000;
            padding: 3px 4px;
            vertical-align: top;
        }

        .no-border td {
            border: none;
        }

        .center {
            text-align: center;
        }


        .bold {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div style="
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 11px;
    line-height: 1.1;
    gap: 15px;
    margin-bottom: 10px;
">
        <!-- Text content -->
        <div style="flex: 1; text-align: center;">
            <!-- Top labels -->
            <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 2px;">
                <div style="text-align: left;">
                    <p style="margin: 0;">Civil Service Form No. 6</p>
                    <p style="margin: 0;">Revised 2020</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0;">ANNEX A</p>
                </div>
            </div>

            <!-- Main header text beside logo -->
            <div style="text-align: center; margin-top: 2px; line-height: 1.1;">
                <strong style="font-size: 15px;">Republic of the Philippines</strong><br>
                <i>Department of Environmental and Natural Resources</i><br>
                <strong style="color: #228B22; font-size: 20px;">Environmental Management Bureau XI</strong><br>
                3rd Avenue Corner V. Guzman St., Brgy. 27-C, Sta. Davao City<br>
                Email: embdavxi@yahoo.com / website: emb.gov.ph/portal/r11<br>
                Telefax No. (082) 233-0809 / Tel Nos. (082) 234-0061, (082) 234-0166
            </div>
        </div>
    </div>
    <h3>APPLICATION FOR LEAVE</h3>
    <p class="date">{{ $date_of_filing }}</p>

    <table>
        <tr>
            <td colspan="2"><b>1. OFFICE/DEPARTMENT:</b> {{ $department }}</td>
            <td colspan="3"><b>2. FULLNAME:</b> {{ $lastname }}, {{ $firstname }} {{ $middlename }}</td>
        </tr>
        <tr>
            <td colspan="2"><b>3. DATE OF FILING:</b> {{ $date_of_filing }}</td>
            <td><b>4. POSITION:</b> {{ $position }}</td>
            <td colspan="2"><b>5. SALARY:</b> {{ $salary }}</td>
        </tr>
    </table>

    <table>
        <tr>
            <th colspan="5" class="center">6. DETAILS OF APPLICATION</th>
        </tr>
        <tr>
            <td colspan="3" style="width: 50%;">
                <b>A. TYPE OF LEAVE TO BE AVAILED OF:</b><br>

                {!! $leave_type === 'Vacation Leave' ? '☑' : '☐' !!} Vacation Leave (Sec.51, Rule XVI, Omnibus
                Rules)<br>
                {!! $leave_type === 'Mandatory/Forced Leave' ? '☑' : '☐' !!} Mandatory/Forced Leave (Sec.51, Rule
                XVI)<br>
                {!! $leave_type === 'Wellness Leave' ? '☑' : '☐' !!} Wellness Leave (Sec.43, Rule XVI)<br>
                {!! $leave_type === 'Sick Leave' ? '☑' : '☐' !!} Sick Leave (Sec.43, Rule XVI)<br>
                {!! $leave_type === 'Maternity Leave' ? '☑' : '☐' !!} Maternity Leave (RA 11210)<br>
                {!! $leave_type === 'Paternity Leave' ? '☑' : '☐' !!} Paternity Leave (RA 8187)<br>
                {!! $leave_type === 'Special Privilege Leave' ? '☑' : '☐' !!} Special Privilege Leave (Sec.21, Rule
                XVI)<br>
                {!! $leave_type === 'Solo Parent Leave' ? '☑' : '☐' !!} Solo Parent Leave (RA 8972)<br>
                {!! $leave_type === 'Study Leave' ? '☑' : '☐' !!} Study Leave (EO 292)<br>
                {!! $leave_type === '10-Day VAWC Leave' ? '☑' : '☐' !!} 10-Day VAWC Leave (RA 9262)<br>
                {!! $leave_type === 'Rehabilitation Privilege' ? '☑' : '☐' !!} Rehabilitation Privilege (Sec.55, Rule
                XVI)<br>
                {!! $leave_type === 'Special Leave Benefits for Women' ? '☑' : '☐' !!} Special Leave Benefits for Women
                (RA 9710)<br>
                {!! $leave_type === 'Special Emergency (Calamity) Leave' ? '☑' : '☐' !!} Special Emergency (Calamity)
                Leave (CSC MC No. 02, 2018)<br>
                {!! $leave_type === 'Adoption Leave' ? '☑' : '☐' !!} Adoption Leave (R.A. No. 8552)<br>
                {!! $leave_type === 'Compensatory Time Off (COC)' ? '☑' : '☐' !!} Others<br>
            </td>
            <td colspan="2" style="width: 50%;">
                <b>B. DETAILS OF LEAVE:</b><br>
                <i>In case of vacation/special Privilege Leave</i><br>
                &nbsp;{{ $leavespent === 'within_philippines' ? '☑' : '☐' }} Within the Philippines<br>
                &nbsp;{{ $leavespent === 'abroad' ? '☑' : '☐' }} Abroad (Specify) _______________________<br>

                In case of sick leave:<br>
                &nbsp;{{ $leavespent === 'in_hospital' ? '☑' : '☐' }} In hospital (Specify) ____________________<br>
                &nbsp;{{ $leavespent === 'out_patient' ? '☑' : '☐' }} Out patient (Specify) ___________________<br>

                <i>In case of Special Leave Benefits for Women</i><br>
                (Specify Illness) ___________________________<br>

                <i>In case of Study Leave</i><br>
                &nbsp;{{ $leavespent === 'completion_of_master_degree' ? '☑' : '☐' }} Completion of Master's Degree<br>
                &nbsp;{{ $leavespent === 'bar_board_examination_review' ? '☑' : '☐' }} BAR/Board Examination
                Review<br>
                <i>Other Purposes</i><br>
                &nbsp;{{ $leavespent === 'monetization_of_leave_credits' ? '☑' : '☐' }} Monetization of Leave
                Credits<br>
                &nbsp;{{ $leavespent === 'terminal_leave' ? '☑' : '☐' }} Terminal Leave<br>
                &nbsp;{{ $leavespent === 'others' ? '☑' : '☐' }} Others<br>
            </td>
        </tr>
    </table>

    <table>

        <tr>
            <td colspan="3" style="width: 50%;">
                <b>C. NUMBER OF WORKING DAYS APPLIED FOR:</b><br>
                <span style="display: inline-block; border-bottom: 1px solid black; min-width: 150px;">
                    &nbsp; &nbsp;{{ $no_of_days }}
                </span><br><br>
                <p>INCLUSIVE DATES:</p>
                <span style="display: inline-block; border-bottom: 1px solid black; min-width: 250px;">
                    &nbsp;{{ $inclusive_dates }}
                </span>
            </td>

            <td colspan="2" style="width: 50%;">
                <b>D. COMMUTATION:</b><br>
                {!! $request_status ? '☑ Requested<br>☐ Not Requested' : '☐ Requested<br>☑ Not Requested'!!}
                <br>
                <br><br>
                <div colspan="2" class="signature-cell-applicant">
                    <div class="sign-block">
                        <img src="{{ $esignature }}"
                            class="signature-img"
                            alt="Applicant Signature">

                        <div class="sign-name">
                            <strong>
                                <span class="underline long-line">
                                    {{ $firstname }} {{ strtoupper(substr($middlename, 0, 1)) }}. {{ $lastname }}
                                </span>
                            </strong><br>
                            Signature of Applicant

                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <th colspan="5" class="center">7. DETAILS OF ACTION ON APPLICATION</th>
        </tr>
        <tr>
            <td colspan="3" style="width: 50%;">
                <b>A. CERTIFICATION OF LEAVE CREDITS</b><br>
                As of {{ \Carbon\Carbon::now()->format('F d, Y') }}<br><br>

                <table>
                    <tr>
                        <th></th>
                        <th>Vacation Leave</th>
                        <th>Sick Leave</th>
                    </tr>
                    <tr>
                        <td>Total Earned</td>
                        <td> {{ $vacation_leave }}</td>
                        <td>{{ $sick_leave }}</td>
                    </tr>
                    <tr>
                        <td>Less this application</td>
                        <td> {{ $used_vacation }}</td>
                        <td>{{ $used_sick }}</td>
                    </tr>
                    <tr>
                        <td>Balance</td>
                        <td> {{ $balance_vacation }}</td>
                        <td>{{ $balance_sick }}</td>
                    </tr>
                </table>
                <div colspan="2" class="signature-cell">
                    <div class="sign-block">
                        <img src="{{ public_path('signatures/geli.png') }}"
                            class="signature-img"
                            alt="Geli Signature">

                        <div class="sign-name">
                            <strong>
                                <span class="underline long-line">
                                    JILMA MAE E. GELI
                                </span>
                            </strong><br>
                            HRMO<br>
                            Authorized Officer
                        </div>
                    </div>
                </div>
            </td>
            <td colspan="2" style="width: 50%;">
                <b>B. RECOMMENDATION</b><br>
                ☑ For approval<br>
                ☐ For disapproval due to: <br>
                ___________________________<br>
                ___________________________<br>
                ___________________________<br><br><br><br>
                <div colspan="2" class="signature-cell">
                    <div class="sign-block">
                        <img src="{{ public_path('signatures/llanos.png') }}"
                            class="signature-img"
                            alt="Llanos Signature">

                        <div class="sign-name">
                            <strong>
                                <span class="underline long-line">
                                    ENGR. MYHRRA FAIR C. LLANOS
                                </span>
                            </strong><br>
                            OIC, Chief FAD<br>
                            Authorized Officer
                        </div>
                    </div>
                </div>
            </td>

        </tr>
    </table>
    <table>
        <tr>
            <td>
                <b>C. APPROVED FOR:</b><br>
                _______ days with pay<br>
                _______ days without pay<br>
                _______ others (Specify)
            </td>
            <td>
                <b>D. DISAPPROVED DUE TO:</b><br>
                ______________________________<br>
                ______________________________<br>
                _______________________________
            </td>
        </tr>
        <tr>
            <td colspan="2" class="signature-cell">
                <div class="sign-block">
                    <img src="{{ public_path('signatures/alvarez.png') }}"
                        class="signature-img"
                        alt="Alvarez Signature">

                    <div class="sign-name">
                        <strong>
                            <span class="underline long-line">
                                EnP ALNULFO M. ALVAREZ
                            </span>
                        </strong><br>
                        Regional Director
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>