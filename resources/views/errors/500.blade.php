<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 Server Error</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
        }

        h1 {
            font-size: 60px;
            color: #dc3545;
            margin-bottom: 10px;
        }

        p {
            color: #555;
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
        }

        .btn:hover {
            background: #0056b3;
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>500</h1>

        <h2>Internal Server Error</h2>

        <p>
            Something went wrong on the server.
        </p>

        <p>
            Please contact your System Administrator
            or try again later.
        </p>

        <a href="{{ url('/') }}" class="btn">
            Return Home
        </a>
    </div>

</body>

</html>