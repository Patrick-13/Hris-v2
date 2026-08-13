<?php

namespace App\Jobs;

use App\Models\Personnelemployeedevice;
use App\Services\ZkBioTimeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncZkEmployeeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $deviceEmployeeIds;

    /**
     * Create a new job instance.
     */
    public function __construct(array $deviceEmployeeIds)
    {
        $this->deviceEmployeeIds = $deviceEmployeeIds;
    }

    /**
     * Execute the job.
     */
    public function handle(ZkBioTimeService $zkService)
    {
        $zkEmployeeIds = [];

        foreach ($this->deviceEmployeeIds as $deviceEmployeeId) {
            $deviceEmployee = Personnelemployeedevice::find($deviceEmployeeId);
            if (!$deviceEmployee) continue;

            try {
                $response = Http::withHeaders([
                    'Authorization' => 'JWT ' . $zkService->getToken(),
                ])
                    ->timeout(60)
                    ->retry(3, 500)
                    ->post(config('services.zkbiotime.url') . '/personnel/api/employees/', [
                        'emp_code'   => $deviceEmployee->emp_code,
                        'department' => 1,
                        'area'       => [2],
                        'app_status' => 1,
                    ]);

                if ($response->failed()) {
                    throw new \Exception('ZK Create failed: ' . $response->body());
                }

                $zkEmployeeId = $response->json('id');
                if ($zkEmployeeId) {
                    $deviceEmployee->update(['zk_employee_id' => $zkEmployeeId]);
                    $zkEmployeeIds[] = $zkEmployeeId;
                }
            } catch (\Exception $e) {
                Log::error("ZK Sync failed for device employee {$deviceEmployeeId}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Resync all successfully created employees in bulk
        if (!empty($zkEmployeeIds)) {
            try {
                $zkService->resyncEmployees($zkEmployeeIds);
            } catch (\Exception $e) {
                Log::error('Bulk ZK resync failed', ['error' => $e->getMessage()]);
            }
        }
    }
}
