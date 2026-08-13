<?php

use App\Http\Controllers\Admin\ButtonController;
use App\Http\Controllers\Admin\DtrController;
use App\Http\Controllers\Admin\LeaveCreditLogsController;
use App\Http\Controllers\Admin\LeaveTypeController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Guest\IclockTransactionController as GuestIclockTransactionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Superuser\UserAccessController;
use App\Http\Controllers\User\EmployeeDeviceAssignmentController;
use App\Http\Controllers\Admin\EmployeeLeaveController;
use App\Http\Controllers\Pdf\InventoryFileExcel;
use App\Http\Controllers\User\EmployeeLeaveController as UserEmployeeLeaveController;
use App\Http\Controllers\User\EmployeeOvertimeController;
use App\Http\Controllers\User\OvertimeAccomplishmentController;
use App\Http\Controllers\User\TkoController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/maintenance', function () {
    return Inertia::render('Maintenance');
});

Route::get('/inactiveaccount', function () {
    return Inertia::render('Inactiveaccount');
})->name('inactiveaccount');


Route::redirect('/', '/login');
Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/iclocktransactionguest', [GuestIclockTransactionController::class, 'Index'])->name('iclocktransactionguest.index');

Route::get('/otp', fn() => Inertia::render('Auth/OtpVerify', [
    'email' => Auth::user()->email
]))->name('otp.page');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/verify-otp', [OtpController::class, 'verifyOtp'])->middleware('throttle:60,1')
        ->name('otp.verify');

    //leavetype route
    Route::get('/leavetype', [LeaveTypeController::class, 'index'])->name('leavetype.index');
    Route::post('/leavetype', [LeaveTypeController::class, 'store'])->name('leavetype.store');
    Route::get('/leavetype/{leavetypeId}/edit', [LeaveTypeController::class, 'edit']);
    Route::put('/leavetype/{id}', [LeaveTypeController::class, 'update'])->name('leavetype.update');
    Route::delete('/leavetype/{id}', [LeaveTypeController::class, 'destroy'])
        ->name('leavetype.destroy');

    //leave credit logs
    Route::get('/leavecreditlog', [LeaveCreditLogsController::class, 'index'])->name('leavecreditlog.index');

    //employee leave route
    route::get('/employeeleave', [UserEmployeeLeaveController::class, 'index'])->name('employeeleave.index');
    Route::put('/employeeleave/{id}/approve', [UserEmployeeLeaveController::class, 'approve'])->name('employeeleave.approve');
    Route::get('/employeeleave/{id}', [UserEmployeeLeaveController::class, 'show']);
    Route::post('/employeeleave/bulk-approve', [UserEmployeeLeaveController::class, 'bulkApprove'])->name('employeeleave.bulk-approve');


    //Tko Route
    route::get('/tko', [TkoController::class, 'index'])->name('tko.index');
    Route::get('/tko/{id}', [TkoController::class, 'show']);
    Route::put('/tko/{id}/approve', [TkoController::class, 'approve'])->name('tko.approve');
    Route::get('/tko/{filename}', [TkoController::class, 'showFile'])
        ->where('filename', '.*');

    //employee accomplishment
    route::get('/employeeovertimeccomplishment', [OvertimeAccomplishmentController::class, 'index'])->name('employeeovertimeccomplishment.index');
    Route::post('/aro/bulk-approve', [OvertimeAccomplishmentController::class, 'bulkApprove'])->name('aro.bulk-approve');
    Route::post('/aro/bulk-returned', [OvertimeAccomplishmentController::class, 'bulkReturned'])->name('aro.bulk-returned');
    Route::get('/employeeovertimeccomplishment/{filename}', [OvertimeAccomplishmentController::class, 'showFile'])
        ->where('filename', '.*');
    //device-assignment route
    route::get('/device-assignment', [EmployeeDeviceAssignmentController::class, 'index'])->name('device-assignment.index');
    Route::post('/device-assignment', [EmployeeDeviceAssignmentController::class, 'store'])->name('device-assignment.store');
    Route::get('/device-assignment/{deviceId}/edit', [EmployeeDeviceAssignmentController::class, 'edit']);
    Route::get('/device-assignment/{deviceId}/show', [EmployeeDeviceAssignmentController::class, 'show']);
    Route::put('/device-assignment/{id}', [EmployeeDeviceAssignmentController::class, 'update'])->name('device-assignment.update');

    Route::get('/search', [SearchController::class, 'search'])->name('search');

    Route::get('/user/{userId}/modules', [UserAccessController::class, 'getUserModules']);
    Route::get('/user/{userId}/submodules', [UserAccessController::class, 'getUserSubmodules']);
    Route::get('/user/{userId}/buttons', [UserAccessController::class, 'getUserButtons']);

    Route::get('/export-inventory', [InventoryFileExcel::class, 'exportInventoryExcel'])->name('export.inventory');

    //system buttons
    Route::get('/button', [ButtonController::class, 'index'])->name('button.index');
    Route::post('/button', [ButtonController::class, 'store'])->name('button.store');
    Route::get('/button/{buttonId}/edit', [ButtonController::class, 'edit']);
    Route::put('/button/{id}', [ButtonController::class, 'update'])->name('button.update');

    Route::get('/dtr-photo/{filename}', [DtrController::class, 'showPhoto'])
        ->where('filename', '.*');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/user.php';
require __DIR__ . '/superadmin.php';
