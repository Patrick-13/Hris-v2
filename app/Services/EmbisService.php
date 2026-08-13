<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EmbisService
{
    public function login()
    {
        $response = Http::withoutVerifying()
            ->withHeaders([
                'Accept' => 'application/json',
            ])
            ->get(config('services.embis.login_url'), [
                'key' => config('services.embis.api_key'), // 🔑 must be "key"
            ]);

        if ($response->successful()) {
            return $response->json()['api_access'] ?? null;
        }
    }

    public function getTravelData($dateFrom, $dateTo)
    {
        $apiAccess = $this->login();

        if (!$apiAccess) {
            return [];
        }

        $allData = [];
        $page = 1;

        do {
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post(config('services.embis.travel_url'), [
                    'api_key' => config('services.embis.api_key'),
                    'api_access' => $apiAccess,
                    'date_start' => $dateFrom,
                    'date_end' => $dateTo,
                    'page' => $page,
                ]);

            if (!$response->successful()) {
                break;
            }

            $json = $response->json();

            $data = $json['data'] ?? [];
            $totalPages = $json['total_pages'] ?? 1;

            $allData = array_merge($allData, $data);

            $page++;
        } while ($page <= $totalPages);

        return $allData;
    }
}
