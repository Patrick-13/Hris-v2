<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

    <div style="max-width:600px; margin:30px auto; background:#ffffff; padding:30px; border-radius:10px;">

        <!-- LOGO -->
        <div style="text-align:center;">
            <img src="{{ asset('denr_logo.png') }}" alt="EMB Logo" style="width:120px; margin-bottom:15px;">
        </div>

        <!-- HEADER -->
        <h2 style="text-align:center; color:#338c26; margin-bottom:5px;">
            Environmental Management Bureau
        </h2>

        <p style="text-align:center; font-size:12px; color:#c30010;">
            ***THIS IS AN AUTOMATED EMAIL. PLEASE DO NOT REPLY.***
        </p>

        <hr style="margin:20px 0;">

        <!-- MESSAGE -->
        <p style="font-size:14px; color:#333;">
            Your One-Time Password (OTP) for verification is:
        </p>

        <!-- OTP BOX -->
        <div style="text-align:center; margin:20px 0;">
            <div
                style="display:inline-block; padding:15px 30px; font-size:28px; letter-spacing:5px; font-weight:bold; background:#f0f0f0; border-radius:8px; color:#338c26">
                {{ $otp }}
            </div>
        </div>

        <p style="font-size:14px; color:#333;">
            This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p style="font-size:14px; color:#333;">
            If you did not request this OTP, please ignore this email.
        </p>

        <hr style="margin:20px 0;">

        <!-- FOOTER -->
        <p style="text-align:center; font-size:12px; color:#777;">
            Environmental Management Bureau XI
        </p>

        <p style="text-align:center; font-size:12px; color:#777;">
            For concerns, please contact MIS
        </p>

    </div>

</body>

</html>