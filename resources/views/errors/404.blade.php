<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 - Page Not Found</title>

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
        max-width: 700px;
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
        background: rgba(245,158,11,0.15);
        color: #fbbf24;
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
        font-size: 60px;
        color: #fbbf24;
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

    /* ICON */
    .icon {
        width: 140px;
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
        <div class="badge">PAGE NOT FOUND</div>
        <div class="agency">ENVIRONMENTAL MANAGEMENT BUREAU</div>
        <div style="font-size:12px;color:#9ca3af;margin-bottom:15px;">
            Human Resource Information System (HRIS)
        </div>

        <!-- ICON (Compass / Lost page theme) -->
        <div class="icon">
            <svg viewBox="0 0 200 200" width="100%">
                
                <!-- circle -->
                <circle cx="100" cy="100" r="75" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>

                <!-- compass needle -->
                <polygon points="100,50 110,100 100,150 90,100" fill="#22c55e">
                    <animateTransform attributeName="transform"
                        type="rotate"
                        from="0 100 100"
                        to="360 100 100"
                        dur="8s"
                        repeatCount="indefinite"/>
                </polygon>

                <!-- center dot -->
                <circle cx="100" cy="100" r="6" fill="#fbbf24"/>

            </svg>
        </div>

        <!-- TEXT -->
        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
            The page you are looking for might have been removed, renamed, or is temporarily unavailable.
            <br><br>
            Please check the URL or return to the main HRIS dashboard.
        </p>

        <!-- BUTTONS -->
        <div class="buttons">
            <a href="{{ url('/') }}" class="btn primary">Go to Dashboard</a>
            <a href="javascript:history.back()" class="btn secondary">Go Back</a>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            © Environmental Management Bureau • HRIS Navigation Notice
        </div>

    </div>

</div>

</body>
</html>