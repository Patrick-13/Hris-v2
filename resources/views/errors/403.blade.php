<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden</title>

    <style>
        body{
            font-family:Arial,sans-serif;
            background:#f4f4f4;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            margin:0;
        }

        .container{
            background:white;
            padding:40px;
            border-radius:12px;
            text-align:center;
            box-shadow:0 0 10px rgba(0,0,0,0.1);
        }

        h1{
            font-size:60px;
            color:#dc3545;
        }

        .btn{
            padding:10px 20px;
            background:#007bff;
            color:white;
            text-decoration:none;
            border-radius:6px;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>403</h1>
    <h2>Access Forbidden</h2>

    <p>
        You do not have permission to access this page.
    </p>

    <a href="{{ url('/') }}" class="btn">
        Return Home
    </a>
</div>

</body>
</html>