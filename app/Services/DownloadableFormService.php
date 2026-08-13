<?php

namespace App\Services;

use App\DTOs\DownloadableFormData;
use App\Models\Downloadableform;
use App\Models\Formtype;
use Illuminate\Support\Facades\Storage;


class DownloadableFormService
{

    public function storeDownloadableForm(DownloadableFormData $data): Downloadableform
    {
        $path = null;

        $formtypedata = Formtype::where("id", $data->form_type)->first();

        if ($data->dfFile) {
            $file = $data->dfFile;
            // Sanitize the folder name (remove spaces/special chars)
            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', $formtypedata->name);
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs("downloadableform/{$folder}", $filename, 'network');
        }

        return Downloadableform::create([
            'name' => $data->name,
            'description' => $data->description,
            'form_type' => $data->form_type,
            'dfFile' => $path ? $path : null,
        ]);
    }

    public function updateDownloadableForm(DownloadableFormData $data, int $id): Downloadableform
    {
        $downloadableform = Downloadableform::findOrFail($id);

        $path = null;

        if ($data->dfFile) {
            $file = $data->dfFile;
            // Sanitize the folder name (remove spaces/special chars)
            $folder = preg_replace('/[^A-Za-z0-9_\-]/', '_', $data->description);
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs("downloadableform/{$folder}", $filename, 'network');
        }

        $downloadableform->update([
            'name' => $data->name,
            'description' => $data->description,
            'form_type' => $data->form_type,
            'dfFile' => $path ? $path : null,
        ]);

        return $downloadableform;
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
