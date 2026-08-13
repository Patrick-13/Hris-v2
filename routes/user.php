<?php

use App\Http\Controllers\Admin\DtrController;
use App\Http\Controllers\Admin\FormTypeController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\Notification\LeaveApprovalController;
use App\Http\Controllers\Notification\OvertimeApprovalController;
use App\Http\Controllers\Notification\TkoApprovalController;
use App\Http\Controllers\Pdf\exportCTOLeave;
use App\Http\Controllers\Pdf\exportLeaveCardExcel;
use App\Http\Controllers\Pdf\exportPayroll;
use App\Http\Controllers\Pdf\exportPdfsFileLeave;
use App\Http\Controllers\Pdf\exportPdsFileExcel;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\ActivityFileController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\DependentController;
use App\Http\Controllers\User\DownloadableFormController;
use App\Http\Controllers\User\EducationController;
use App\Http\Controllers\User\JobController;
use App\Http\Controllers\User\MigrationController;
use App\Http\Controllers\User\MyContactController;
use App\Http\Controllers\User\MyDeviceController;
use App\Http\Controllers\User\MyInfoController;
use App\Http\Controllers\User\MyLeaveCreditController;
use App\Http\Controllers\User\OrgchartController;
use App\Http\Controllers\User\PersonnelContactEmergencyController;
use App\Http\Controllers\User\PersonnelEligibilityLicensesController;
use App\Http\Controllers\User\PersonnelEsignatureController;
use App\Http\Controllers\User\SalaryController;
use App\Http\Controllers\User\WorkExperienceController;
use App\Models\Barangay;
use App\Models\City;
use App\Models\Province;
use App\Models\Region;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\EmployeeController as PersonnelEmployeeController;
use App\Http\Controllers\User\EmployeeOvertimeController;
use App\Http\Controllers\User\HolidayController;
use App\Http\Controllers\User\MyActivityController;
use App\Http\Controllers\User\MyDtrController;
use App\Http\Controllers\User\MyLeaveController;
use App\Http\Controllers\User\MyOvertimeConroller;
use App\Http\Controllers\User\MyOvertimeCreditController;
use App\Http\Controllers\User\MyPayrollController;
use App\Http\Controllers\User\MyTkoController;
use App\Http\Controllers\User\OvertimeAccomplishmentController;
use App\Http\Controllers\User\PrivacyConcentController;
use App\Http\Controllers\User\TrainingController;
use App\Http\Controllers\User\TrainingFileController;
use Inertia\Inertia;

Route::prefix('user')->middleware(['auth', 'inactiveaccount', 'verified'])->group(function () {
    Route::get('/userdashboard', [UserDashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('userdashboard');

    // Route::get('/export-leavecard', [exportLeaveCardExcel::class, 'exportLeaveCardExcel'])->name('export.leavecard');

    Route::post('/ai/chat', [AiController::class, 'ask']);

    Route::get('/ai', function () {
        return Inertia::render('Ai/Index');
    })->name('ai');


    //myactivity route
    route::get('/myactivity', [MyActivityController::class, 'index'])->name('myactivity.index');
    Route::post('/myactivity', [MyActivityController::class, 'store'])->name('myactivity.store');
    Route::get('/myactivity/{activityId}/edit', [MyActivityController::class, 'edit'])->name('myactivity.edit');
    Route::get('/myactivity/{activityId}/attach', [MyActivityController::class, 'attendancereport'])->name('myactivity.attendance');
    Route::get('/myactivity/{activityId}/show', [MyActivityController::class, 'show'])->name('myactivity.show');
    Route::post('/myactivityfile', [ActivityFileController::class, 'store'])->name('myactivityfile.store');
    Route::put('/myactivity/{id}', [MyActivityController::class, 'update'])->name('myactivity.update');
    Route::get('/myactivityfile/{filename}', [ActivityFileController::class, 'show'])
        ->where('filename', '.*');
    //mydevice route
    route::get('/mydevice', [MyDeviceController::class, 'index'])->name('mydevice.index');
    //Myleave
    Route::get('/myleavecredit', [MyLeaveCreditController::class, 'index'])->name('myleavecredit.index');
    //overtime credit route
    Route::get('/myovertimecredit', [MyOvertimeCreditController::class, 'index'])->name('myovertimecredit.index');


    route::get('/mydtr', [MyDtrController::class, 'index'])->name('mydtr.index');
    Route::get('/mydtr/geofence', [MyDtrController::class, 'geofence'])->name('mydtr.geofence');
    Route::post('/dtr/punch', [MyDtrController::class, 'punch'])
        ->middleware('throttle:10,1');
    Route::get('/dtr/download', [MyDtrController::class, 'downloadDtrEmployee']);

    Route::post('/privacy-consent', [PrivacyConcentController::class, 'accept']);


    Route::get('/training/{trainingId}/attach', [TrainingController::class, 'learningreport'])->name('training.learningreport');
    //trainingfile route
    Route::post('/trainingfile', [TrainingFileController::class, 'store'])->name('trainingfile.store');
    Route::get('/trainingfile/{filename}', [TrainingFileController::class, 'show'])
        ->where('filename', '.*');


    Route::post('/employee', [PersonnelEmployeeController::class, 'store'])->name('employee.store');
    Route::get('/employee/{employeeId}/edit', [PersonnelEmployeeController::class, 'edit'])->name('employee.edit');;
    Route::put('/employee/{id}', [PersonnelEmployeeController::class, 'update'])->name('employee.update');
    Route::get('/employee/create/import', [PersonnelEmployeeController::class, 'import'])->name('employee.import');
    Route::post('/employee/import/csv', [PersonnelEmployeeController::class, 'import_employee'])
        ->name('employee.import_employee');
    Route::get('/employee/export/excel', [PersonnelEmployeeController::class, 'exportExcel']);
    Route::get('/employee/export/csv', [PersonnelEmployeeController::class, 'exportCsv']);

    Route::get('/export-pdf-leave/{id}', [exportPdfsFileLeave::class, 'exportpdfleave']);
    Route::get('/export-pdf-cto/{id}', [exportCTOLeave::class, 'exportpdfctoleave']);


    //employee leave route
    route::get('/myleave', [MyLeaveController::class, 'index'])->name('myleave.index');
    Route::post('/myleave', [MyLeaveController::class, 'store'])->name('myleave.store');
    Route::get('/myleave/{employeeleaveId}/edit', [MyLeaveController::class, 'edit']);
    Route::put('/myleave/{id}', [MyLeaveController::class, 'update'])->name('myleave.update');

    //typeform route
    route::get('/typeform', [FormTypeController::class, 'index'])->name('typeform.index');
    Route::post('/typeform', [FormTypeController::class, 'store'])->name('typeform.store');
    Route::get('/typeform/{formtypeId}/edit', [FormTypeController::class, 'edit']);
    Route::put('/typeform/{id}', [FormTypeController::class, 'update'])->name('typeform.update');

    //holiday route
    route::get('/holiday', [HolidayController::class, 'index'])->name('holiday.index');
    Route::post('/holiday', [HolidayController::class, 'store'])->name('holiday.store');
    Route::get('/holiday/{holidayId}/edit', [HolidayController::class, 'edit']);
    Route::put('/holiday/{id}', [HolidayController::class, 'update'])->name('holiday.update');

    //downloadableform route
    route::get('/downloadform', [DownloadableFormController::class, 'index'])->name('downloadform.index');
    Route::post('/downloadform', [DownloadableFormController::class, 'store'])->name('downloadform.store');
    Route::get('/downloadform/{downloadformId}/edit', [DownloadableFormController::class, 'edit']);
    Route::put('/downloadform/{id}', [DownloadableFormController::class, 'update'])->name('downloadform.update');
    Route::get('/downloadableform/{filename}', [DownloadableFormController::class, 'show'])
        ->where('filename', '.*');

    // Route::get('/test-network', function () {
    //     return Storage::disk('network')->files();
    // });

    //employee overtime route
    route::get('/employeeovertime', [EmployeeOvertimeController::class, 'index'])->name('employeeovertime.index');
    Route::get('/employeeovertime/{id}', [EmployeeOvertimeController::class, 'show'])->name('employeeovertime.show');
    Route::put('/employeeovertime/{id}/approve', [EmployeeOvertimeController::class, 'approve'])->name('employeeovertime.approve');
    Route::post('/employeeovertime/bulk-approve', [EmployeeOvertimeController::class, 'bulkApprove'])->name('employeeovertime.bulk-approve');

    //employee overtime route
    route::get('/myovertime', [MyOvertimeConroller::class, 'index'])->name('myovertime.index');
    Route::get('/employeeovertime/{id}/attachment', [MyOvertimeConroller::class, 'attachment'])->name('employeeovertime.attachment');
    Route::get('/employeeovertime/{id}/showaccomplishment', [MyOvertimeConroller::class, 'showaccomplishment'])->name('employeeovertime.showaccomplishment');
    Route::post('/employeeovertime/{id}/accomplishment', [MyOvertimeConroller::class, 'accomplishment'])->name('employeeovertime.accomplishment');
    Route::post('/employeeovertime', [MyOvertimeConroller::class, 'store'])->name('employeeovertime.store');
    Route::get('/employeeovertime/{employeeleaveId}/edit', [MyOvertimeConroller::class, 'edit']);
    Route::put('/employeeovertime/{id}', [MyOvertimeConroller::class, 'update'])->name('employeeovertime.update');
    //employee overtime accomplisment route
    Route::get('/employeeovertimeccomplishment/{employeeId}/edit', [OvertimeAccomplishmentController::class, 'edit']);
    Route::post('/employeeovertimeccomplishment/{id}', [OvertimeAccomplishmentController::class, 'update'])->name('employeeovertimeccomplishment.update');

    //employee profile and esignature
    Route::post('/employeeprofilesignature', [PersonnelEsignatureController::class, 'store'])
        ->name('employeeprofilesignature.store');
    Route::get('/employeeprofilesignature/{employeeId}', [PersonnelEsignatureController::class, 'show'])
        ->name('employeeprofilesignature.show');
    Route::get(
        '/employeeprofilesignature/file/{employeeId}/{type}',
        [PersonnelEsignatureController::class, 'file']
    )->name('employeeprofilesignature.file');


    //orgchart route
    Route::get('/orgchart', [OrgchartController::class, 'index'])->name('orgchart.index');

    //MyInfo route
    Route::get('/myinfo', [MyInfoController::class, 'index'])->name('myinfo.index');

    //Contact Details route
    Route::post('/mycontact', [MyContactController::class, 'store'])->name('mycontact.store');
    Route::get('/mycontact/{mycontactId}/edit', [MyContactController::class, 'edit']);
    Route::put('/mycontact/{id}', [MyContactController::class, 'update'])->name('mycontact.update');

    //Contact Emergency route
    Route::post('/emergencycontact', [PersonnelContactEmergencyController::class, 'store'])->name('emergencycontact.store');
    Route::get('/emergencycontact/{emergencycontacteId}/edit', [PersonnelContactEmergencyController::class, 'edit']);
    Route::put('/emergencycontact/{id}', [PersonnelContactEmergencyController::class, 'update'])->name('emergencycontact.update');

    //Dependent route
    Route::post('/dependent', [DependentController::class, 'store'])->name('dependent.store');
    Route::get('/dependent/{dependentId}/edit', [DependentController::class, 'edit']);
    Route::put('/dependent/{id}', [DependentController::class, 'update'])->name('dependent.update');

    //Job route
    Route::post('/job', [JobController::class, 'store'])->name('job.store');
    Route::get('/job/{jobId}/edit', [JobController::class, 'edit']);
    Route::put('/job/{id}', [JobController::class, 'update'])->name('job.update');

    //salary route
    Route::post('/salary', [SalaryController::class, 'store'])->name('salary.store');
    Route::get('/salary/{salaryId}/edit', [SalaryController::class, 'edit']);
    Route::put('/salary/{id}', [SalaryController::class, 'update'])->name('salary.update');

    //migration route
    Route::post('/migration', [MigrationController::class, 'store'])->name('migration.store');
    Route::get('/migration/{migrationId}/edit', [MigrationController::class, 'edit']);
    Route::put('/migration/{id}', [MigrationController::class, 'update'])->name('migration.update');


    //education route
    Route::post('/education', [EducationController::class, 'store'])->name('education.store');
    Route::get('/education/{migrationId}/edit', [EducationController::class, 'edit']);
    Route::put('/education/{id}', [EducationController::class, 'update'])->name('education.update');

    //workexperience route
    Route::post('/workexperience', [WorkExperienceController::class, 'store'])->name('workexperience.store');
    Route::get('/workexperience/{workexperienceId}/edit', [WorkExperienceController::class, 'edit']);
    Route::put('/workexperience/{id}', [WorkExperienceController::class, 'update'])->name('workexperience.update');

    //eligibility
    Route::post('/eligibility', [PersonnelEligibilityLicensesController::class, 'store'])->name('eligibility.store');
    Route::get('/eligibility/{eligibilityId}/edit', [PersonnelEligibilityLicensesController::class, 'edit']);
    Route::put('/eligibility/{id}', [PersonnelEligibilityLicensesController::class, 'update'])->name('eligibility.update');

    //pdf route
    Route::get('/export-pds', [exportPdsFileExcel::class, 'exportFilledExcel'])->name('export.pds');

    //Notifications Route
    Route::get('/overtime/pending/raro', [OvertimeApprovalController::class, 'pendingRAROApprovals']);
    Route::get('/overtime/pending/aro', [OvertimeApprovalController::class, 'pendingAROApprovals']);
    Route::get('/notifications', [LeaveApprovalController::class, 'notification'])
        ->name('notification');
    Route::get('/tko/pending/', [TkoApprovalController::class, 'pendingTkoApprovals']);

    //MyTKO
    route::get('/mytko', [MyTkoController::class, 'index'])->name('mytko.index');
    Route::post('/mytko', [MyTkoController::class, 'store'])->name('mytko.store');
    Route::get('/mytko/{tkoId}/edit', [MyTkoController::class, 'edit']);
    Route::get('/mytko/{id}', [MyTkoController::class, 'show']);
    Route::post('/mytko/{id}', [MyTkoController::class, 'update'])->name('mytko.update');
    Route::get('/mytko/{filename}', [MyTkoController::class, 'showFile'])
        ->where('filename', '.*');

    //Mypayroll Route
    route::get('/mypayroll', [MyPayrollController::class, 'index'])->name('mypayroll.index');
    Route::get('/export-pdf-payroll/{id}', [exportPayroll::class, 'exportPayrollPdf']);



    //address route
    Route::get('/regions', fn() => response()->json(Region::all()));

    Route::get('/regions/{code}', function ($code) {
        return response()->json(
            Region::where('code', $code)->firstOrFail()
        );
    });

    Route::get('/regions/{regionCode}/provinces', function ($regionCode) {
        return response()->json(
            Province::where('region_code', $regionCode)->get()
        );
    });

    Route::get('/provinces/{provinceCode}/cities', function ($provinceCode) {
        return response()->json(
            City::where('province_code', $provinceCode)->get()
        );
    });

    Route::get('/cities/{cityCode}/barangays', function ($cityCode) {
        return response()->json(
            Barangay::where('city_code', $cityCode)->get()
        );
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
