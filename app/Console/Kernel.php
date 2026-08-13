<?php

namespace App\Console;

use App\Services\LeaveCreditService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */


    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            app(LeaveCreditService::class)->addMonthlyLeaveCredits();
        })->dailyAt('15:15');

        $schedule->command('iclock:sync-dtr')
            ->everyMinute()
            ->withoutOverlapping();

        $schedule->command('email:lunch-break-reminder')
            ->weekdays()
            ->dailyAt('17:20');

        $schedule->command('autoapproved:leave')->dailyAt('23:59');
    }

    /**
     * Register the commands for your application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');
    }
}
