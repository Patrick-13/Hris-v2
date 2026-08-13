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
        Schema::create('tko_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tko_id')
                ->constrained('tkos')
                ->cascadeOnDelete();
            $table->string('approver_id')->nullable();
            $table->foreign('approver_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();
            $table->enum('level', ['section', 'division', 'rd', 'hr']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->unique(['tko_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tko_approvals');
    }
};
