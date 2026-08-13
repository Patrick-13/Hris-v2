<?php

use App\Http\Controllers\Api\DashboardController as ApiDashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\MyDtrController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/employee', [EmployeeController::class, 'indexApi'])->name('employee.indexApi');

    Route::get('mobile/dashboard', [ApiDashboardController::class, 'index']);

    Route::get('/employee/me', [EmployeeController::class, 'meApi']);

    Route::post('/dtr/punch', [MyDtrController::class, 'punch']);

    Route::get('/iclocktransaction', [EmployeeController::class, 'IclocktransactionApi']);
});

Route::post('/login', [AuthController::class, 'login']);

// Route::post('/dtr', [DtrController::class, 'store'])->name('dtr.store');
