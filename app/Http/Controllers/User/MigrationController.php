<?php

namespace App\Http\Controllers\User;

use App\DTOs\MigrationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\MigrationStoreRequest;
use App\Http\Requests\MigrationUpdateRequest;
use App\Models\PersonnelMigration;
use App\Services\MigrationService;
use Illuminate\Http\Request;

class MigrationController extends Controller
{


    protected MigrationService $migrationService;

    public function __construct(MigrationService $migrationService)
    {
        $this->migrationService = $migrationService;
    }

    public function store(MigrationStoreRequest $request)
    {
        $dto = MigrationData::fromArray($request->validated());

        $this->migrationService->createMigration($dto);

        return redirect()->back()->with(['success' => 'Migration data Created successfully.']);
    }

    public function edit($id)
    {
        $migration = PersonnelMigration::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($migration);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MigrationUpdateRequest $request, $id)
    {
        $dto = MigrationData::fromArray($request->validated());

        $this->migrationService->updateMigration($dto, $id);

        return redirect()->back()->with(['success' => 'Migration data updated successfully.']);
    }
}
