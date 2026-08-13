<?php

use App\Exports\LeaveCardExport;
use App\Http\Controllers\Admin\ActivityTypeController;
use App\Http\Controllers\Admin\AdminDownloadableForm;
use App\Http\Controllers\Admin\AroController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CocCreditController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\DtrController;
use App\Http\Controllers\Admin\EmployeeDeductionController;
use App\Http\Controllers\Admin\EmployeeLeaveController;
use App\Http\Controllers\Admin\LeaveCreditController as AdminLeaveCreditController;
use App\Http\Controllers\Admin\MemoController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\OfficeController;
use App\Http\Controllers\Admin\PayrollController;
use App\Http\Controllers\Admin\PositionController;
use App\Http\Controllers\Admin\RaroController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SubmoduleController;
use App\Http\Controllers\Admin\TkoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserloginlogController;
use App\Http\Controllers\Notification\TkoApprovalController;
use App\Http\Controllers\Pdf\exportLeaveCardExcel;
use App\Http\Controllers\Pdf\exportPayrollFileExcel;
use App\Http\Controllers\Superuser\UserAccessController;
use App\Http\Controllers\User\ActivityController;
use App\Http\Controllers\User\ActivityFileController;
use App\Http\Controllers\User\EmployeeController;
use App\Http\Controllers\User\EmployeeMovementController;
use App\Http\Controllers\User\TrainingController;
use App\Http\Controllers\Zkteco\IclockTransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/adminaccess', function () {
    return Inertia::render('Adminaccess'); // Or wherever you show the account disabled message
})->name('adminaccess');

Route::prefix('admin')->middleware(['auth', 'admin', 'verified', 'throttle:60,1'])->group(function () {
    Route::get('/admindashboard', [AdminDashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('admindashboard');

    Route::get('/export-leavecard', [exportLeaveCardExcel::class, 'exportLeaveCardExcel'])->name('export.leavecard');

    //iclock transaction
    Route::get('/iclocktransaction', [IclockTransactionController::class, 'index'])->name('iclocktransaction.index');
    //activity type route
    route::get('/activitytype', [ActivityTypeController::class, 'index'])->name('activitytype.index');
    Route::post('/activitytype', [ActivityTypeController::class, 'store'])->name('activitytype.store');
    Route::get('/activitytype/{leavetypeId}/edit', [ActivityTypeController::class, 'edit']);
    Route::put('/activitytype/{id}', [ActivityTypeController::class, 'update'])->name('activitytype.update');

    //activity route
    route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
    Route::post('/activity', [ActivityController::class, 'store'])->name('activity.store');
    Route::get('/activity/{activityId}/show', [ActivityController::class, 'show'])->name('activity.show');
    Route::get('/activity/{activityId}/attach', [ActivityController::class, 'attendancereport'])->name('activity.attendance');
    Route::get('/activity/{activityId}/edit', [ActivityController::class, 'edit'])->name('activity.edit');
    Route::put('/activity/{id}', [ActivityController::class, 'update'])->name('activity.update');
    //trainingfile route
    Route::post('/activityfile', [ActivityFileController::class, 'store'])->name('activityfile.store');
    Route::get('/activityfile/{filename}', [ActivityFileController::class, 'show'])
        ->where('filename', '.*');

    //company route
    route::get('/company', [CompanyController::class, 'index'])->name('company.index');
    Route::post('/company', [CompanyController::class, 'store'])->name('company.store');
    Route::get('/company/{companyId}/edit', [CompanyController::class, 'edit']);
    Route::put('/company/{id}', [CompanyController::class, 'update'])->name('company.update');

    //office route
    route::get('/office', [OfficeController::class, 'index'])->name('office.index');
    Route::post('/office', [OfficeController::class, 'store'])->name('office.store');
    Route::get('/office/{officeId}/edit', [OfficeController::class, 'edit']);
    Route::put('/office/{id}', [OfficeController::class, 'update'])->name('office.update');

    //dtr route
    route::get('/dtr', [DtrController::class, 'index'])->name('dtr.index');
    Route::post('/dtr', [DtrController::class, 'store'])->name('dtr.store');
    Route::get('/dtr/{dtrId}/show', [DtrController::class, 'show'])->name('dtr.show');
    Route::get('/dtr/{dtrId}/edit', [DtrController::class, 'edit']);
    Route::put('/dtr/{id}', action: [DtrController::class, 'update'])->name('dtr.update');
    Route::post('/dtr/send-email', [DtrController::class, 'sendDtrEmployeeEmail'])
        ->name('dtr.sendEmail');


    //division route
    route::get('/division', [DivisionController::class, 'index'])->name('division.index');
    Route::post('/division', [DivisionController::class, 'store'])->name('division.store');
    Route::get('/division/{divisionId}/edit', [DivisionController::class, 'edit']);
    Route::put('/division/{id}', [DivisionController::class, 'update'])->name('division.update');

    //category route
    route::get('/category', [CategoryController::class, 'index'])->name('category.index');
    Route::post('/category', [CategoryController::class, 'store'])->name('category.store');
    Route::get('/category/{divisionId}/edit', [CategoryController::class, 'edit']);
    Route::put('/category/{id}', [CategoryController::class, 'update'])->name('category.update');


    //employeemovement route
    route::get('/employeemovement', [EmployeeMovementController::class, 'index'])->name('employeemovement.index');
    Route::post('/employeemovement', [EmployeeMovementController::class, 'store'])->name('employeemovement.store');
    Route::get('/employeemovement/{employeemovementId}/edit', [EmployeeMovementController::class, 'edit']);
    Route::put('/employeemovement/{id}', [EmployeeMovementController::class, 'update'])->name('employeemovement.update');

    //leavecredit route
    Route::get('/leavecredit', [AdminLeaveCreditController::class, 'index'])->name('leavecredit.index');
    Route::post('/leavecredit', [AdminLeaveCreditController::class, 'store'])->name('leavecredit.store');
    Route::get('/leavecredit/{leavetypeId}/edit', [AdminLeaveCreditController::class, 'edit']);
    Route::put('/leavecredit/{id}', [AdminLeaveCreditController::class, 'update'])->name('leavecredit.update');
    Route::post('/leavecredit/import/csv', [AdminLeaveCreditController::class, 'import'])->name('leavecredit.import');

    //coccredit route
    Route::get('/coccredit', [CocCreditController::class, 'index'])->name('coccredit.index');

    //training route
    route::get('/training', [TrainingController::class, 'index'])->name('training.index');
    Route::post('/training', [TrainingController::class, 'store'])->name('training.store');
    Route::get('/training/{trainingId}/show', [TrainingController::class, 'show'])->name('training.show');
    Route::get('/training/{trainingId}/edit', [TrainingController::class, 'edit'])->name('training.edit');
    Route::put('/training/{id}', [TrainingController::class, 'update'])->name('training.update');

    //device route
    route::get('/device', [DeviceController::class, 'index'])->name('device.index');
    Route::post('/device', [DeviceController::class, 'store'])->name('device.store');
    Route::get('/device/{deviceId}/edit', [DeviceController::class, 'edit']);
    Route::put('/device/{id}', [DeviceController::class, 'update'])->name('device.update');

    //section route
    route::get('/section', [SectionController::class, 'index'])->name('section.index');
    Route::post('/section', [SectionController::class, 'store'])->name('section.store');
    Route::get('/section/{sectionId}/edit', [SectionController::class, 'edit']);
    Route::put('/section/{id}', [SectionController::class, 'update'])->name('section.update');

    //position route
    route::get('/position', [PositionController::class, 'index'])->name('position.index');
    Route::post('/position', [PositionController::class, 'store'])->name('position.store');
    Route::get('/position/{positionId}/edit', [PositionController::class, 'edit']);
    Route::put('/position/{id}', [PositionController::class, 'update'])->name('position.update');

    //module route
    route::get('/module', [ModuleController::class, 'index'])->name('module.index');
    Route::post('/module', [ModuleController::class, 'store'])->name('module.store');
    Route::get('/module/{moduleId}/edit', [ModuleController::class, 'edit']);
    Route::put('/module/{id}', [ModuleController::class, 'update'])->name('module.update');

    //memo route
    route::get('/memo', [MemoController::class, 'index'])->name('memo.index');
    Route::post('/memo', [MemoController::class, 'store'])->name('memo.store');
    Route::get('/memo/{memoId}/edit', [MemoController::class, 'edit']);
    Route::put('/memo/{id}', [MemoController::class, 'update'])->name('memo.update');

    //sub module route
    route::get('/submodule', [SubmoduleController::class, 'index'])->name('submodule.index');
    Route::post('/submodule', [SubmoduleController::class, 'store'])->name('submodule.store');
    Route::get('/submodule/{moduleId}/edit', [SubmoduleController::class, 'edit']);
    Route::put('/submodule/{id}', [SubmoduleController::class, 'update'])->name('submodule.update');

    Route::get('/usermodule', [UserAccessController::class, 'index'])->name('usermodule.index');
    Route::get('/usermodule/{usermoduleId}/show', [UserAccessController::class, 'show'])->name('usermodule.show');
    Route::get('/user-modules', [UserAccessController::class, 'create']);
    Route::get('/usermodule/{usermodule}/edit', [UserAccessController::class, 'edit'])->name('usermodule.edit');
    Route::get('/user-modules', [UserAccessController::class, 'getUserModules']);
    Route::put('/usermodule/{id}/buttons/update-access', [UserAccessController::class, 'updatebuttonAccess'])->name('button.updatebuttonAccess');
    Route::put('/usermodule/{id}/modules/update-access', [UserAccessController::class, 'updateModuleAccess'])->name('usermodule.updateModuleAccess');
    Route::put('/usermodule/{id}/submodules/update-access', [UserAccessController::class, 'updateSubmoduleAccess'])->name('submodule.updateSubmoduleAccess');

    Route::get('/user/{userId}/edit', [UserController::class, 'edit']);
    Route::put('/user/{id}', [UserController::class, 'update'])->name('user.update');

    route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
    Route::post('/employee/bulk-approve', [EmployeeController::class, 'bulkApprove'])->name('employee.bulk-approve');
    Route::resource('userloginlog', UserloginlogController::class);

    //deduction route
    route::get('/deduction', [EmployeeDeductionController::class, 'index'])->name('deduction.index');
    Route::post('/deduction', [EmployeeDeductionController::class, 'store'])->name('deduction.store');
    Route::get('/deduction/{deductionId}/edit', [EmployeeDeductionController::class, 'edit']);
    Route::put('/deduction/{id}', [EmployeeDeductionController::class, 'update'])->name('deduction.update');

    route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::post('/payroll/generate', [PayrollController::class, 'generate'])
        ->name(name: 'payroll.generate');
    Route::post('/payroll/bulk-approve', [PayrollController::class, 'bulkApprove'])->name('payroll.bulk-approve');

    Route::get('/export-payroll', [exportPayrollFileExcel::class, 'exportPayrollExcel'])->name('export.payroll');

    route::get('/downloadformadmin', [AdminDownloadableForm::class, 'index'])->name('downloadformadmin.index');
    Route::post('/downloadformadmin', [AdminDownloadableForm::class, 'store'])->name('downloadformadmin.store');
    Route::get('/downloadformadmin/{downloadformId}/edit', [AdminDownloadableForm::class, 'edit']);
    Route::put('/downloadformadmin/{id}', [AdminDownloadableForm::class, 'update'])->name('downloadformadmin.update');
    Route::get('/downloadformadmin/{filename}', [AdminDownloadableForm::class, 'show'])
        ->where('filename', '.*');

    //admin tko
    route::get('/admintko', [TkoController::class, 'index'])->name('admintko.index');
    Route::get('/admintko/{id}', [TkoController::class, 'show']);
    Route::put('/admintko/{id}/approve', [TkoController::class, 'approve'])->name('admintko.approve');
    Route::get('/admintko/{filename}', [TkoController::class, 'showFile'])
        ->where('filename', '.*');

    //notification admin
    Route::get('/tko/view/pending/', [TkoApprovalController::class, 'pendingTkoAdminView']);

    //employee Leave 
    route::get('/employeeleave/view', [EmployeeLeaveController::class, 'index'])->name('employeeleaveadmin.index');

    //Raro Route
    route::get('/raro/view', [RaroController::class, 'index'])->name('raro.index');

    //Aro Route
    route::get('/aro/view', [AroController::class, 'index'])->name('aro.index');
    Route::get('/aro/{id}/showaccomplishment', [AroController::class, 'showaccomplishment'])->name('aro.showaccomplishment');
});
