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
        Schema::table('leave_credits', function (Blueprint $table) {
            $table->decimal('entitled', 8, 2)->change();
            $table->decimal('used', 8, 2)->default(0)->change();
            $table->decimal('balance', 8, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_credits', function (Blueprint $table) {
            $table->dropColumn('entitled');
            $table->dropColumn('used');
            $table->dropColumn('balance');
        });
    }
};
