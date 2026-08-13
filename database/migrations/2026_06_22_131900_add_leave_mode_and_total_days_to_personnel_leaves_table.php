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
        Schema::table('personnel_leaves', function (Blueprint $table) {
            $table->string('leave_mode')->nullable()->after('leave_type_id');
            $table->decimal('total_days', 5, 2)->default(0)->after('leave_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_leaves', function (Blueprint $table) {
            $table->dropColumn(['leave_mode', 'total_days']);
        });
    }
};
