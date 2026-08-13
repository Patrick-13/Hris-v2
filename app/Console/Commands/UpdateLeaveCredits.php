<?php

namespace App\Console\Commands;

use App\Services\LeaveCreditService;
use Illuminate\Console\Command;

class UpdateLeaveCredits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leave:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update employee leave credits manually or via scheduler';

    /**
     * Execute the console command.
     */
    public function handle(LeaveCreditService $leaveCreditService)
    {
        $leaveCreditService->addMonthlyLeaveCredits();
        $this->info('Leave credits updated successfully!');
    }
}
