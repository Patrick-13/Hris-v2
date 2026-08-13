<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>419 - Session Expired</title>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Segoe UI", sans-serif;
    }

    body {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #0b3d2e, #0f172a);
        color: #e5e7eb;
    }

    .wrapper {
        width: 90%;
        max-width: 650px;
        text-align: center;
        animation: fadeIn 0.6s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .card {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        padding: 40px;
        backdrop-filter: blur(12px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }

    /* HEADER */
    .badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(239,68,68,0.15);
        color: #f87171;
        font-size: 12px;
        margin-bottom: 10px;
    }

    .agency {
        font-size: 13px;
        letter-spacing: 2px;
        color: #a7f3d0;
        margin-bottom: 5px;
    }

    h1 {
        font-size: 56px;
        color: #f87171;
        margin-bottom: 10px;
    }

    h2 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #d1d5db;
    }

    p {
        font-size: 14px;
        color: #9ca3af;
        line-height: 1.6;
        margin-bottom: 25px;
    }

    /* BUTTONS */
    .buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .btn {
        padding: 10px 16px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 14px;
        transition: 0.3s;
    }

    .primary {
        background: #22c55e;
        color: #0b3d2e;
        font-weight: 600;
    }

    .primary:hover {
        background: #16a34a;
    }

    .secondary {
        border: 1px solid #64748b;
        color: #e5e7eb;
    }

    .secondary:hover {
        background: rgba(255,255,255,0.05);
    }

    .danger {
        background: #ef4444;
        color: white;
    }

    .danger:hover {
        background: #dc2626;
    }

    /* ICON ANIMATION */
    .icon {
        width: 120px;
        margin: 0 auto 15px auto;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }

    .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #6b7280;
    }

</style>
</head>

<body>

<div class="wrapper">

    <div class="card">

        <!-- HEADER -->
        <div class="badge">SESSION EXPIRED</div>
        <div class="agency">ENVIRONMENTAL MANAGEMENT BUREAU</div>
        <div style="font-size:12px;color:#9ca3af;margin-bottom:15px;">
            Human Resource Information System (HRIS)
        </div>

        <!-- ICON -->
        <div class="icon">
            <svg viewBox="0 0 200 200" width="100%">
                <circle cx="100" cy="100" r="70" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>

                <!-- clock -->
                <circle cx="100" cy="100" r="40" fill="none" stroke="#f87171" stroke-width="3"/>

                <!-- hands -->
                <line x1="100" y1="100" x2="100" y2="75" stroke="#f87171" stroke-width="3">
                    <animateTransform attributeName="transform"
                        type="rotate"
                        from="0 100 100"
                        to="360 100 100"
                        dur="6s"
                        repeatCount="indefinite"/>
                </line>

                <line x1="100" y1="100" x2="120" y2="100" stroke="#f87171" stroke-width="3">
                    <animateTransform attributeName="transform"
                        type="rotate"
                        from="360 100 100"
                        to="0 100 100"
                        dur="10s"
                        repeatCount="indefinite"/>
                </line>
            </svg>
        </div>

        <!-- TEXT -->
        <h1>419</h1>
        <h2>Session Expired</h2>

        <p>
            Your session has expired due to inactivity for security reasons.  
            Please log in again to continue using the EMB HRIS system.
        </p>

        <p>
            If this happens frequently, try avoiding long idle periods or contact your system administrator.
        </p>

        <!-- BUTTONS -->
        <div class="buttons">
            <a href="{{ url('/login') }}" class="btn primary">Login Again</a>
            <a href="javascript:location.reload()" class="btn secondary">Retry</a>
            <a href="{{ url()->previous() }}" class="btn danger">Go Back</a>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            © Environmental Management Bureau • HRIS Security Notice
        </div>

    </div>

</div>

</body>
</html>