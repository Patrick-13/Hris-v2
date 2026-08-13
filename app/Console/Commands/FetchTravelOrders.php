<?php

namespace App\Console\Commands;

use App\Models\TravelOrder;
use App\Services\EmbisService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;


class FetchTravelOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'travelorders:fetch {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Travel Orders from API and store in DB';

    /**
     * Execute the console command.
     */
    public function handle(EmbisService $embisService)
    {
        $dateFrom = Carbon::now()->startOfWeek(Carbon::MONDAY)->format('Y-m-d');
        $dateTo   = Carbon::now()->startOfWeek(Carbon::MONDAY)->addDays(4)->format('Y-m-d');

        $travelOrders = $embisService->getTravelData($dateFrom, $dateTo);

        if (empty($travelOrders)) {
            $this->error('No data fetched.');
            return 1;
        }

        foreach ($travelOrders as $order) {

            // OPTIONAL: only save signed documents
            if ($order['travel_application_status'] !== 'Signed Document') {
                continue;
            }

            TravelOrder::updateOrCreate(
                ['travel_id' => $order['travel_id']],
                [
                    'employee_id' => $order['employee_id'],
                    'employee_name' => $order['employee_name'],
                    'employee_division' => $order['employee_division'],
                    'employee_section' => $order['employee_section'],
                    'employee_designation' => $order['employee_designation'],
                    'travel_scope' => $order['travel_scope'],
                    'travel_type' => $order['travel_type'],
                    'travel_applied_date' => $order['travel_applied_date'],
                    'travel_departure_date' => $order['travel_departure_date'],
                    'travel_return_date' => $order['travel_return_date'],
                    'travel_official_station' => $order['travel_official_station'],
                    'travel_destination' => $order['travel_destination'],
                    'travel_purpose' => $order['travel_purpose'],
                    'travel_pier_diem' => $order['travel_pier_diem'],
                    'travel_assistant' => $order['travel_assistant'],
                    'travel_remarks' => $order['travel_remarks'],
                    'travel_report_submission' => $order['travel_report_submission'],
                    'travel_application_status' => $order['travel_application_status'],
                ]
            );
        }

        $this->info('Travel orders synced successfully.');
    }
}
