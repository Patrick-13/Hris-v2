<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZkBioTimeService
{
    /**
     * Create a new class instance.
     */
    protected string $baseUrl;
    protected string $username;
    protected string $password;

    public function __construct()
    {
        $this->baseUrl  = config('services.zkbiotime.url');
        $this->username = config('services.zkbiotime.username');
        $this->password = config('services.zkbiotime.password');
    }

    public function getToken(): string
    {

        return Cache::remember('zkbiotime_jwt', now()->addHours(24), function () {

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
                ->timeout(10)
                ->retry(3, 200)
                ->post(
                    config('services.zkbiotime.url') .
                        config('services.zkbiotime.auth_endpoint'),
                    [
                        'username' => config('services.zkbiotime.username'),
                        'password' => config('services.zkbiotime.password'),
                    ]
                );


            if ($response->failed()) {
                Log::error('ZKBioTime Auth Failed', [
                    'response' => $response->body()
                ]);

                throw new \Exception('ZKBioTime authentication failed');
            }

            return $response->json('token');
        });
    }


    public function get(string $endpoint)
    {
        return Http::withToken($this->getToken())
            ->get("{$this->baseUrl}/{$endpoint}")
            ->json();
    }

    public function resyncEmployees(array $zkEmployeeIds): void
    {
        if (empty($zkEmployeeIds)) return;

        $attempt = 0;
        while ($attempt < 3) {
            $attempt++;
            sleep(3); // allow ZK to process
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'JWT ' . $this->getToken(),
                    'Content-Type'  => 'application/json',
                ])
                    ->timeout(30)
                    ->post($this->baseUrl . '/personnel/api/employees/sync/', [
                        'employees' => $zkEmployeeIds,
                    ]);

                if ($response->failed()) {
                    throw new \Exception($response->body());
                }

                Log::info('ZK Employees resynced', ['employees' => $zkEmployeeIds]);
                break; // success
            } catch (\Throwable $e) {
                Log::warning("ZK sync attempt {$attempt} failed: {$e->getMessage()}");
            }
        }
    }
}
