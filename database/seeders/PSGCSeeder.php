<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Region;
use App\Models\Province;
use App\Models\City;
use App\Models\Barangay;

class PSGCSeeder extends Seeder
{
    public function run(): void
    {
        $regions = Http::get("https://psgc.gitlab.io/api/regions/")->json();

        foreach ($regions as $region) {
            $regionCode = $region['code'];

            // Seed region
            Region::updateOrCreate(
                ['code' => $region['code']],
                [
                    'name' => $region['regionName'],

                ]
            );

            // Fetch provinces of this region
            $provinces = Http::get("https://psgc.gitlab.io/api/regions/{$regionCode}/provinces/")->json();

            foreach ($provinces as $province) {
                Province::updateOrCreate(
                    ['code' => $province['code']],
                    [
                        'name' => $province['name'],
                        'region_code' => $regionCode
                    ]
                );

                // Fetch cities/municipalities
                $cities = Http::get("https://psgc.gitlab.io/api/provinces/{$province['code']}/cities-municipalities/")->json();

                foreach ($cities as $city) {
                    City::updateOrCreate(
                        ['code' => $city['code']],
                        [
                            'name' => $city['name'],
                            'province_code' => $province['code']
                        ]
                    );

                    // Fetch barangays
                    $barangays = Http::get("https://psgc.gitlab.io/api/cities-municipalities/{$city['code']}/barangays/")->json();

                    foreach ($barangays as $barangay) {
                        Barangay::updateOrCreate(
                            ['code' => $barangay['code']],
                            [
                                'name' => $barangay['name'],
                                'city_code' => $city['code']
                            ]
                        );
                    }
                }
            }
        }

        echo "✅ All Philippine regions seeded successfully.\n";
    }
}
