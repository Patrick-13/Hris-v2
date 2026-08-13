<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    // config/services.php
    // 'facebio' => [
    //     'url' => env('FACEBIO_API'),
    //     'jwt' => env('JWT'),
    // ],

    'zkbiotime' => [
        'url' => env('ZKBIOTIME_URL'),
        'auth_endpoint' => env('ZKBIOTIME_AUTH_ENDPOINT'),
        'username' => env('ZKBIOTIME_USERNAME'),
        'password' => env('ZKBIOTIME_PASSWORD'),
    ],

    'embis' => [
        'api_key' => env('EMBIS_API_KEY'),
        'login_url' => env('EMBIS_LOGIN_URL'),
        'travel_url' => env('EMBIS_TRAVEL_URL'),
    ],


    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
