<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubmodulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('submodules')->insert([
            [
                'id' => 1,
                'submoduleName' => 'Inventory Item',
                'module_id' => 6,
                'created_at' => Carbon::parse('2025-12-09 13:34:41'),
                'updated_at' => Carbon::parse('2025-12-09 13:34:49'),
            ],
            [
                'id' => 2,
                'submoduleName' => 'Inventory Assignment',
                'module_id' => 6,
                'created_at' => Carbon::parse('2025-12-09 13:38:07'),
                'updated_at' => Carbon::parse('2025-12-09 13:38:07'),
            ],
            [
                'id' => 3,
                'submoduleName' => 'Employee List',
                'module_id' => 7,
                'created_at' => Carbon::parse('2025-12-09 13:38:19'),
                'updated_at' => Carbon::parse('2025-12-09 13:38:19'),
            ],
            [
                'id' => 4,
                'submoduleName' => 'Movements',
                'module_id' => 7,
                'created_at' => Carbon::parse('2025-12-09 13:38:28'),
                'updated_at' => Carbon::parse('2025-12-09 13:38:28'),
            ],
            [
                'id' => 5,
                'submoduleName' => 'Leave Credits',
                'module_id' => 8,
                'created_at' => Carbon::parse('2025-12-09 13:38:42'),
                'updated_at' => Carbon::parse('2025-12-09 13:38:42'),
            ],
            [
                'id' => 6,
                'submoduleName' => 'Leave Status',
                'module_id' => 8,
                'created_at' => Carbon::parse('2025-12-09 13:38:49'),
                'updated_at' => Carbon::parse('2025-12-09 13:38:49'),
            ],
            [
                'id' => 7,
                'submoduleName' => 'Form Type',
                'module_id' => 10,
                'created_at' => Carbon::parse('2025-12-09 13:39:02'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:02'),
            ],
            [
                'id' => 8,
                'submoduleName' => 'Form Download',
                'module_id' => 10,
                'created_at' => Carbon::parse('2025-12-09 13:39:10'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:10'),
            ],
            [
                'id' => 9,
                'submoduleName' => 'Activity Type',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:39:28'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:28'),
            ],
            [
                'id' => 10,
                'submoduleName' => 'Company',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:39:38'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:38'),
            ],
            [
                'id' => 11,
                'submoduleName' => 'Category',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:39:46'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:46'),
            ],
            [
                'id' => 12,
                'submoduleName' => 'Division',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:39:52'),
                'updated_at' => Carbon::parse('2025-12-09 13:39:52'),
            ],
            [
                'id' => 13,
                'submoduleName' => 'Section',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:02'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:02'),
            ],
            [
                'id' => 14,
                'submoduleName' => 'Position',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:09'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:09'),
            ],
            [
                'id' => 15,
                'submoduleName' => 'Leave Type',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:18'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:18'),
            ],
            [
                'id' => 16,
                'submoduleName' => 'Module',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:26'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:26'),
            ],
            [
                'id' => 17,
                'submoduleName' => 'Sub Module',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:34'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:34'),
            ],
            [
                'id' => 18,
                'submoduleName' => 'User Access',
                'module_id' => 9,
                'created_at' => Carbon::parse('2025-12-09 13:40:47'),
                'updated_at' => Carbon::parse('2025-12-09 13:40:47'),
            ],
            [
                'id' => 19,
                'submoduleName' => 'Leave Approval',
                'module_id' => 8,
                'created_at' => Carbon::parse('2025-12-09 14:28:19'),
                'updated_at' => Carbon::parse('2025-12-09 14:28:19'),
            ],
        ]);
    }
}
