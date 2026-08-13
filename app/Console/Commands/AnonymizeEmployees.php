<?php

namespace App\Console\Commands;

use App\Models\PersonnelEmployee;
use App\Models\Personnelemployeedevice;
use App\Models\User;
use Illuminate\Console\Command;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class AnonymizeEmployees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:anonymize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Anonymize employee names in both HRIS and biometric databases';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $faker = Faker::create();

        PersonnelEmployee::chunkById(25, function ($employees) use ($faker) {

            foreach ($employees as $employee) {

                $firstname = $faker->firstName();
                $lastname  = $faker->lastName();
                $middlename = strtoupper($faker->randomLetter());
                $middleInitial = $middlename
                    ? strtolower(substr($middlename, 0, 1))
                    : 'x'; // fallback if no middle name

                $username = strtolower($lastname . '.' . substr($firstname, 0, 1) . $middleInitial);

                // Update HRIS database
                $employee->update([
                    'firstname' => $firstname,
                    'lastname' => $lastname,
                    'middlename' => $middlename,
                    'email'    => $username . '@demo.local',
                    'sss'         => sprintf(
                        '%02d-%07d-%1d',
                        random_int(10, 99),
                        random_int(1000000, 9999999),
                        random_int(0, 9)
                    ),

                    'pagibig'     => sprintf(
                        '%04d-%04d-%04d',
                        random_int(1000, 9999),
                        random_int(1000, 9999),
                        random_int(1000, 9999)
                    ),

                    'tin'         => sprintf(
                        '%03d-%03d-%03d-%03d',
                        random_int(100, 999),
                        random_int(100, 999),
                        random_int(100, 999),
                        random_int(100, 999)
                    ),

                    'philhealth'  => sprintf(
                        '%02d-%09d-%1d',
                        random_int(10, 99),
                        random_int(100000000, 999999999),
                        random_int(0, 9)
                    ),

                    'gsis'        => sprintf('%011d', random_int(10000000000, 99999999999)),
                ]);

                // Update biometric database
                Personnelemployeedevice::where('employee_id', $employee->employee_id)
                    ->update([
                        'first_name' => $firstname,
                        'last_name' => $lastname,
                    ]);



                User::where('employee_id', $employee->employee_id)->update([
                    'name'     => $username,
                    'email'    => $username . '@demo.local',
                    'password' => Hash::make('pass1234!'),
                ]);

                $this->line("Updated {$employee->employee_id}");
            }
        });

        $this->info('Done!');
    }
}
