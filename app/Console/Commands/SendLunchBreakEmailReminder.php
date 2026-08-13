<?php

namespace App\Console\Commands;

use App\Mail\LunchBreakReminderMail;
use App\Models\Dtr;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendLunchBreakEmailReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tko:send-lunch-break-email-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $cutoff = Carbon::today()->setTime(12, 50);

        if ($now->lessThan($cutoff)) {
            return;
        }

        Dtr::with('employeeTransaction')
            ->whereDate('punch_date', today())
            ->where(function ($q) {
                $q->whereNull('breakOut')
                    ->orWhereNull('breakIn');
            })
            ->get()
            ->each(function ($dtr) {

                $employee = $dtr->employeeTransaction;

                if (!$employee || !$employee->email) {
                    return;
                }

                Mail::to($employee->email)
                    ->send(new LunchBreakReminderMail($employee));
            });
    }
}
