<?php

namespace App\Console\Commands;

use App\Services\DtrService;
use Illuminate\Console\Command;

class SyncIclockToDtr extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'iclock:sync-dtr';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync biometric punches to DTR';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        app()->make(DtrService::class)
            ->syncIclockToDtr();

        $this->info('Iclock punches synced successfully.');
    }
}
