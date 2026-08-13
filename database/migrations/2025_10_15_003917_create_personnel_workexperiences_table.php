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
        Schema::create('personnel_workexperiences', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->string('dateFrom')->nullable();
            $table->string('dateTo')->nullable();
            $table->string('jobTitle')->nullable();
            $table->enum('emp_status', ['regular', 'trainee', 'contractual', 'job order', 'permanent', 'summer job'])->default('regular');
            $table->boolean('isGovernment')->default(false);
            $table->string('department')->nullable();
            $table->string('agency')->nullable();
            $table->string('office')->nullable();
            $table->string('company')->nullable();
            $table->string('branch')->nullable();
            $table->string('leave_absent')->nullable();
            $table->float('monthysalary');
            $table->string('paycolumngrade');
            $table->string('separationCause');
            $table->boolean('isActive')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_workexperiences');
    }
};
