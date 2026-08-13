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
        Schema::table('dtrs', function (Blueprint $table) {
            $table->string('flexi_type', 10)->nullable()->after('punch_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dtrs', function (Blueprint $table) {
            $table->dropColumn('flexi_type');
        });
    }
};
