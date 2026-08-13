<?php

namespace App\Services;

use App\DTOs\MigrationData;
use App\Models\PersonnelMigration;

class MigrationService
{
    public function createMigration(MigrationData $data): PersonnelMigration
    {
        return PersonnelMigration::create([
            'employee_id' => $data->employee_id,
            'documentAttachement' => $data->documentAttachement,
            'number' => $data->number,
            'issuedBy' => $data->issuedBy,
            'issuedDate' => $data->issuedDate,
            'expiryDate' => $data->expiryDate,
        ]);
    }

    public function updateMigration(MigrationData $data, int $id): PersonnelMigration
    {
        $migration = PersonnelMigration::findOrFail($id);

        $migration->update([
            'employee_id' => $data->employee_id,
            'documentAttachement' => $data->documentAttachement,
            'number' => $data->number,
            'issuedBy' => $data->issuedBy,
            'issuedDate' => $data->issuedDate,
            'expiryDate' => $data->expiryDate,
        ]);

        return $migration;
    }
}
