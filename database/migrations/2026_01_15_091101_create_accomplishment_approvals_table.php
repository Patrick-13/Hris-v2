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
        Schema::create('accomplishment_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accomplishment_id')
                ->constrained('overtime_accomplishments')
                ->cascadeOnDelete();
            $table->string('approver_id')->nullable();
            $table->foreign('approver_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();
            $table->enum('level', ['section', 'division', 'finance', 'regional', 'hr']); // approval stage
            $table->enum('status', ['pending', 'approved', 'rejected', 'returned', 'resubmitted'])->default('pending');
            $table->unsignedTinyInteger('revision_no')->default(0);
            $table->timestamp('resubmitted_at')->nullable();
            $table->timestamp('returned_at')->nullable(); // optional: track return time
            $table->text('remarks')->nullable();

            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->unique(['accomplishment_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accomplishment_approvals');
    }
};
