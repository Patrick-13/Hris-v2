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
        Schema::table('leave_credit_logs', function (Blueprint $table) {
            $table->foreignId('activity_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('credits', 8, 3)->nullable();
            $table->enum('action', ['grant', 'deduct'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_credit_logs', function (Blueprint $table) {
            Schema::dropIfExists('leave_credit_logs');
        });
    }
};
