<?php

namespace App\Services;

use App\DTOs\TrainingFileData;
use App\Models\PersonnelEmployee;
use App\Models\TrainingFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TrainingFileService
{

    public function storeTrainingFile(TrainingFileData $data): TrainingFile
    {
        $path = null;

        if ($data->ilrFile) {
            $file = $data->ilrFile;
            // Get the employee's lastname
            $employee = $data->employee_id ? PersonnelEmployee::where('employee_id', $data->employee_id)->first() : null;
            $lastname = $employee ? $employee->lastname : 'unknown';

            // Sanitize the folder name (remove spaces/special chars)
            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', $lastname);

            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs("ilr_report/{$folder}", $filename, 'network');
        }

        return TrainingFile::create([
            'employee_id' => $data->employee_id,
            'training_id' => $data->training_id,
            'ilrFile' => $path ? $path : null,
        ]);
    }



    public function showFile(string $filename)
    {
        $filename = urldecode($filename);

        $networkRoot = env('NETWORK_ROOT');
        $username = env('NETWORK_USERNAME');
        $password = env('NETWORK_PASSWORD');

        $networkPath = rtrim($networkRoot, '\\') . '\\' . ltrim($filename, '\\');

        $context = stream_context_create([
            'smb' => [
                'username' => $username,
                'password' => $password,
            ]
        ]);

        // Check file existence first
        if (!file_exists($networkPath)) {
            abort(404, "File not found: {$networkPath}");
        }

        // Detect MIME type dynamically
        $mimeType = mime_content_type($networkPath);

        // Read file content
        $content = @file_get_contents($networkPath, false, $context);

        if ($content === false) {
            abort(403, "File exists but is not readable or access denied.");
        }

        // Return file with correct Content-Type
        return response($content)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . basename($filename) . '"');
    }
}
