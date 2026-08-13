<?php

namespace App\Http\Controllers\User;

use App\DTOs\JobData;
use App\Http\Controllers\Controller;
use App\Http\Requests\JobStoreRequest;
use App\Http\Requests\JobUpdateRequest;
use App\Models\PersonnelJob;
use App\Services\JobService;

class JobController extends Controller
{
    protected JobService $jobService;

    public function __construct(JobService $jobService)
    {
        $this->jobService = $jobService;
    }

    public function store(JobStoreRequest $request)
    {
        $dto = JobData::fromArray($request->validated());

        $this->jobService->createJob($dto);

        return redirect()->back()->with(['success' => 'Job data Created successfully.']);
    }

    public function edit($id)
    {
        $job = $this->jobService->getId($id); // or just find($id) if you don’t want it to 404

        return response()->json($job);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JobUpdateRequest $request, $id)
    {
        $dto = JobData::fromArray($request->validated());

        $this->jobService->updateJob($dto, $id);

        return redirect()->back()->with(['success' => 'Job data updated successfully.']);
    }
}
