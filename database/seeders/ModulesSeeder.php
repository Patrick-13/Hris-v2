<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('modules')->insert([
            [
                'id' => 1,
                'moduleName' => 'Dashboard',
                'created_at' => Carbon::parse('2025-12-09 10:00:05'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:15'),
            ],
            [
                'id' => 2,
                'moduleName' => 'Training Management',
                'created_at' => Carbon::parse('2025-12-09 10:00:23'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:23'),
            ],
            [
                'id' => 3,
                'moduleName' => 'Activity Management',
                'created_at' => Carbon::parse('2025-12-09 10:00:34'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:34'),
            ],
            [
                'id' => 4,
                'moduleName' => 'DTR Management',
                'created_at' => Carbon::parse('2025-12-09 10:00:41'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:41'),
            ],
            [
                'id' => 5,
                'moduleName' => 'Org Chart',
                'created_at' => Carbon::parse('2025-12-09 10:00:48'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:48'),
            ],
            [
                'id' => 6,
                'moduleName' => 'Inventory Management',
                'created_at' => Carbon::parse('2025-12-09 10:00:56'),
                'updated_at' => Carbon::parse('2025-12-09 10:00:56'),
            ],
            [
                'id' => 7,
                'moduleName' => 'Employee Management',
                'created_at' => Carbon::parse('2025-12-09 10:01:04'),
                'updated_at' => Carbon::parse('2025-12-09 10:01:04'),
            ],
            [
                'id' => 8,
                'moduleName' => 'Leave Management',
                'created_at' => Carbon::parse('2025-12-09 10:01:30'),
                'updated_at' => Carbon::parse('2025-12-09 10:01:30'),
            ],
            [
                'id' => 9,
                'moduleName' => 'System Settings',
                'created_at' => Carbon::parse('2025-12-09 10:01:39'),
                'updated_at' => Carbon::parse('2025-12-09 10:01:39'),
            ],
            [
                'id' => 10,
                'moduleName' => 'Downloadable Forms',
                'created_at' => Carbon::parse('2025-12-09 10:01:46'),
                'updated_at' => Carbon::parse('2025-12-09 10:01:46'),
            ],
            [
                'id' => 11,
                'moduleName' => 'My Info',
                'created_at' => Carbon::parse('2025-12-09 14:18:54'),
                'updated_at' => Carbon::parse('2025-12-09 14:18:54'),
            ],
            [
                'id' => 12,
                'moduleName' => 'My Activities',
                'created_at' => Carbon::parse('2025-12-09 14:19:01'),
                'updated_at' => Carbon::parse('2025-12-09 14:19:01'),
            ],
            [
                'id' => 13,
                'moduleName' => 'My Devices',
                'created_at' => Carbon::parse('2025-12-09 14:19:55'),
                'updated_at' => Carbon::parse('2025-12-09 14:19:55'),
            ],
            [
                'id' => 14,
                'moduleName' => 'My Dtr',
                'created_at' => Carbon::parse('2025-12-09 14:20:01'),
                'updated_at' => Carbon::parse('2025-12-09 14:20:01'),
            ],
            [
                'id' => 15,
                'moduleName' => 'Iclock Transaction',
                'created_at' => Carbon::parse('2025-12-15 16:51:34'),
                'updated_at' => Carbon::parse('2025-12-15 16:51:34'),
            ],
            [
                'id' => 16,
                'moduleName' => 'DTR Management',
                'created_at' => Carbon::parse('2025-12-17 21:19:45'),
                'updated_at' => Carbon::parse('2025-12-17 21:19:45'),
            ],
        ]);
    }
}
