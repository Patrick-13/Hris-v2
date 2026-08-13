<?php

namespace App\Services;

use App\DTOs\ActivityFileData;
use App\Models\Activity;
use App\Models\ActivityFiles;
use App\Models\PersonnelEmployee;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActivityFileService
{

    public function storeActivityFile(ActivityFileData $data): ActivityFiles
    {
        $path = null;

        if ($data->activityFile) {
            $file = $data->activityFile;
            // Get the employee's lastname
            $activity = $data->activity_id ? Activity::where('id', $data->activity_id)->first() : null;
            $description = $activity ? $activity->description : 'unknown';

            // Sanitize the folder name (remove spaces/special chars)
            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', $description);

            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs("activity_report/{$folder}", $filename, 'network');
        }

        return ActivityFiles::create([
            'activity_id' => $data->activity_id,
            'activityFile' => $path ? $path : null,
        ]);
    }



    public function showFile(string $filename)
    {
        $filename = urldecode($filename);

        if (!Storage::disk('network')->exists($filename)) {
            abort(404, 'File not found');
        }

        $mimeType = Storage::disk('network')->mimeType($filename);

        return response(
            Storage::disk('network')->get($filename),
            200
        )->header('Content-Type', $mimeType);
    }
}
