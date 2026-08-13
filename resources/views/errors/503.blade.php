<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMB HRIS - System Maintenance</title>

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
            from {
                opacity: 0;
                transform: translateY(15px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        /* HEADER */
        .header {
            margin-bottom: 20px;
        }

        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .agency {
            font-size: 14px;
            letter-spacing: 2px;
            color: #a7f3d0;
        }

        h1 {
            font-size: 56px;
            margin-top: 10px;
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
            background: rgba(255, 255, 255, 0.05);
        }

        /* STATUS DOT */
        .status {
            width: 10px;
            height: 10px;
            background: #f59e0b;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 15px;
            animation: pulse 1.5s infinite;
            box-shadow: 0 0 10px #f59e0b;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.4);
                opacity: 0.5;
            }

            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* ILLUSTRATION */
        .illustration {
            width: 260px;
            margin: 0 auto 15px auto;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-8px);
            }
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
            <div class="header">
                <div class="badge">SYSTEM MAINTENANCE</div>
                <div class="agency">ENVIRONMENTAL MANAGEMENT BUREAU</div>
                <div style="font-size:12px;color:#9ca3af;margin-top:5px;">
                    Human Resource Information System (HRIS v2)
                </div>
            </div>

            <!-- STATUS -->
            <span class="status"></span>

            <!-- ILLUSTRATION (Eco + System) -->
            <div class="illustration">
                <svg viewBox="0 0 200 200" width="100%" height="100%">

                    <!-- background circle -->
                    <circle cx="100" cy="100" r="80" fill="#0f172a" stroke="#22c55e" stroke-width="2" />

                    <!-- leaf -->
                    <path d="M120 60 C90 70, 80 110, 110 140 C140 120, 150 80, 120 60 Z" fill="#22c55e">
                        <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="4s"
                            repeatCount="indefinite" />
                    </path>

                    <!-- gear -->
                    <circle cx="75" cy="110" r="14" fill="#60a5fa">
                        <animateTransform attributeName="transform" type="rotate" from="0 75 110" to="360 75 110"
                            dur="6s" repeatCount="indefinite" />
                    </circle>

                    <!-- small orbit dot -->
                    <circle cx="135" cy="100" r="6" fill="#fbbf24">
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100"
                            dur="5s" repeatCount="indefinite" />
                    </circle>

                </svg>
            </div>

            <!-- TEXT -->
            <h1>503</h1>
            <h2>HRIS Temporarily Unavailable</h2>

            <p>
                The Environmental Management Bureau Human Resource Information System is currently undergoing scheduled
                maintenance to improve system performance, security, and reliability.
                <br><br>
                We appreciate your patience and understanding.
            </p>

            <!-- BUTTONS -->
            <div class="buttons">
                <a href="{{ url('/') }}" class="btn primary">Return to Portal</a>
                <a href="javascript:location.reload()" class="btn secondary">Retry</a>
            </div>

            <!-- FOOTER -->
            <div class="footer">
                © Environmental Management Bureau • HRIS System Maintenance Notice
            </div>

        </div>

    </div>

</body>

</html>