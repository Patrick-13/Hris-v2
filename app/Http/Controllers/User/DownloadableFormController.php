<?php

namespace App\Http\Controllers\User;

use App\DTOs\DownloadableFormData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DownloadableFormStoreRequest;
use App\Http\Requests\DownloadableFormUpdateRequest;
use App\Http\Resources\DownloadableFormResource;
use App\Models\Downloadableform;
use App\Models\Formtype;
use App\Services\DownloadableFormService;

class DownloadableFormController extends Controller
{

    protected DownloadableFormService $downloadbleFormService;

    public function __construct(DownloadableFormService $downloadbleFormService)
    {
        $this->downloadbleFormService = $downloadbleFormService;
    }

    public function index()
    {
        $query = Downloadableform::query();

        if (request()->filled('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        $downloadableform = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $totalCount = $downloadableform->total();

        // Get the count of positions being displayed on the current page
        $currentPageCount = $downloadableform->count();
        $currentPage = $downloadableform->currentPage();

        $formtype = Formtype::all();

        return inertia("User/DownloadableForms/Index", [
            "downloadableforms" => DownloadableFormResource::collection($downloadableform),
            "formtype" => $formtype,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'totalCount' => $totalCount,
            'currentPageCount' => $currentPageCount,
            'currentPage' => $currentPage,
        ]);
    }

    public function store(DownloadableFormStoreRequest $request)
    {
        $data = $request->validated();
        $data['dfFile'] = $request->file('dfFile');
        $dto = DownloadableFormData::fromArray($data);

        $this->downloadbleFormService->storeDownloadableForm($dto);

        return redirect()->back()->with(['success' => 'Downloadable Form Created successfully.']);
    }

    public function edit($id)
    {
        $dowloadableform = Downloadableform::findOrFail($id); // or just find($id) if you don’t want it to 404

        return response()->json($dowloadableform);
    }


    public function show($filename)
    {
        return $this->downloadbleFormService->showFile($filename);
    }

    public function update(DownloadableFormUpdateRequest $request, $id)
    {
        $dto = DownloadableFormData::fromArray($request->validated());

        $this->downloadbleFormService->updateDownloadableForm($dto, $id);

        return redirect()->back()->with(['success' => 'Downloadable Form updated successfully.']);
    }
}
