<!DOCTYPE html>
<html>

<head>
    <title>Payroll</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 20px;
        }

        .header {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 25px;
        }

        .section {
            margin-bottom: 20px;
        }

        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }

        .label {
            width: 60%;
            font-weight: 500;
        }

        .value {
            width: 40%;
            text-align: right;
        }

        hr {
            border: 0;
            border-top: 1px solid #000;
            margin: 5px 0 10px 0;
        }
    </style>
</head>

<body>
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 15px;">
        <img src="{{ public_path('images/payroll_header.jpg') }}" alt="Company Logo"
            style="max-width: 600px; height: auto;">
    </div>

    <!-- Header -->
    <div class="header">
        {{ strtoupper($employee_name) }}<br>
        {{ $position }}<br>
        Contract Duration: {{ $contract_duration }}<br>
        Payroll Period: {{ $payroll_period }}
    </div>

    <!-- Earnings Section -->
    <div class="section">
        <div class="row">
            <div class="label">Rate Monthly</div>
            <div class="value">{{ number_format($monthly_rate, 2) }}</div>
        </div>
        <div class="row">
            <div class="label">Days Rendered</div>
            <div class="value">{{ $days_worked }}</div>
        </div>
        <div class="row">
            <div class="label">Total Earned</div>
            <div class="value">{{ number_format($basic_pay, 2) }}</div>
        </div>
        <div class="row">
            <div class="label">Less: Lates/Undertime</div>
            <div class="value">{{ number_format($late_deduction, 2) }}</div>
        </div>
        <hr>
        <div class="row">
            <div class="label"><strong>Premium</strong></div>
            <div class="value"><strong>{{ number_format($premium, 2) }}</strong></div>
        </div>
        <div class="row">
            <div class="label"><strong>Gross Earned</strong></div>
            <div class="value"><strong>{{ number_format($gross_earned, 2) }}</strong></div>
        </div>
    </div>

    <!-- Deductions Section -->
    <div class="section">
        <div class="row">
            <div class="label"></div>
            <div class="value"></div>
        </div>
        @foreach($deductions as $type => $amount)
            @if(!in_array($type, ['absent_adjustment', 'late_adjustment']))
                <div class="row">
                    <div class="label">{{ strtoupper($type) }}</div>
                    <div class="value">{{ number_format($amount, 2) }}</div>
                </div>
            @endif
        @endforeach
        <hr>
        <div class="row">
            <div class="label"><strong>Total Deduction</strong></div>
            <div class="value"><strong>{{ number_format($total_deductions, 2) }}</strong></div>
        </div>
    </div>

    <!-- Net Earned -->
    <div class="section">
        <div class="row">
            <div class="label"><strong>Net Earned</strong></div>
            <div class="value"><strong>{{ number_format($net_pay, 2) }}</strong></div>
        </div>
    </div>

    <!-- Footer / Signatures -->
    <div style="margin-top:50px; width:100%;">
        <div style="float:left; width:45%; text-align:center;">
            Prepared by:<br>
            <div style="margin-top:40px"></div>
            VESSAIR M. ABDULLAH<br>
            <div style="border-top:1px solid #000;"></div>
            Administrative Aide V
        </div>
        <div style="float:right; width:45%; text-align:center;">
            Certified Correct by:<br>

            <div style="margin-top:40px"></div>
            VALERIE A. TAMPUS<br>
            <div style="border-top:1px solid #000;"></div>
            Chief, Finance Section
        </div>
        <div style="clear:both;"></div>
    </div>

</body>

</html>