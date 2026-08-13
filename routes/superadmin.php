<?php

use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\SubmoduleController;
use App\Http\Controllers\Superuser\UserAccessController;
use Illuminate\Support\Facades\Route;


Route::prefix('superadmin')->middleware(['auth', 'superadmin', 'verified'])->group(function () {

    //module route
    // route::get('/module', [ModuleController::class, 'index'])->name('module.index');
    // Route::post('/module', [ModuleController::class, 'store'])->name('module.store');
    // Route::get('/module/{moduleId}/edit', [ModuleController::class, 'edit']);
    // Route::put('/module/{id}', [ModuleController::class, 'update'])->name('module.update');

    // //sub module route
    // route::get('/submodule', [SubmoduleController::class, 'index'])->name('submodule.index');
    // Route::post('/submodule', [SubmoduleController::class, 'store'])->name('submodule.store');
    // Route::get('/submodule/{moduleId}/edit', [SubmoduleController::class, 'edit']);
    // Route::put('/submodule/{id}', [SubmoduleController::class, 'update'])->name('submodule.update');

    // Route::get('/usermodule', [UserAccessController::class, 'index'])->name('usermodule.index');
    // Route::get('/usermodule/{usermoduleId}/show', [UserAccessController::class, 'show'])->name('usermodule.show');
    // Route::get('/user-modules', [UserAccessController::class, 'create']);
    // Route::get('/usermodule/{usermodule}/edit', [UserAccessController::class, 'edit'])->name('usermodule.edit');
    // Route::get('/user-modules', [UserAccessController::class, 'getUserModules']);
    // Route::put('/usermodule/{id}/buttons/update-access', [UserAccessController::class, 'updatebuttonAccess'])->name('button.updatebuttonAccess');
    // Route::put('/usermodule/{id}/modules/update-access', [UserAccessController::class, 'updateModuleAccess'])->name('usermodule.updateModuleAccess');
    // Route::put('/usermodule/{id}/submodules/update-access', [UserAccessController::class, 'updateSubmoduleAccess'])->name('submodule.updateSubmoduleAccess');
});
