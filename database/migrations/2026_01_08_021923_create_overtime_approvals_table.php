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
        Schema::create('overtime_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('overtime_id')
                ->constrained('personnelovertimes')
                ->cascadeOnDelete();
            $table->string('approver_id')->nullable();
            $table->foreign('approver_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();
            $table->enum('level', ['section', 'division', 'finance', 'regional', 'hr']); // approval stage
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->unique(['overtime_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_approvals');
    }
};
