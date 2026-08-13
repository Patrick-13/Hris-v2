<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('personnel_employees', function (Blueprint $table) {
            $table->boolean('in_office')->default(false)->after('emp_status');
            $table->decimal('daily_rate', 10, 2)->nullable()->after('in_office');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_employees', function (Blueprint $table) {
            $table->dropColumn('in_office');
            $table->dropColumn('daily_rate');
        });
    }
};
