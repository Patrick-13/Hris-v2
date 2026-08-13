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
            $table->string('account_no', 20)->nullable()->after('daily_rate');
            $table->enum('fundtype', ['Regular Fund', 'Regular Fund Enmo', 'ERF', 'PMCC',])->nullable()->after('account_no');
            $table->string('charging')->nullable()->after('fundtype');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_employees', function (Blueprint $table) {
            $table->dropColumn('account_no');
            $table->dropColumn('fundtype');
            $table->dropColumn('charging');
        });
    }
};
