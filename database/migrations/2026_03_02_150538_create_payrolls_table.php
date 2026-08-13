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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();

            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();

            $table->date('payroll_from');
            $table->date('payroll_to');

            // Prevent duplicate payroll per employee per period
            $table->unique(
                ['employee_id', 'payroll_from', 'payroll_to'],
                'unique_employee_payroll_period'
            );

            $table->decimal('monthly_rate', 12, 2);
            $table->decimal('daily_rate', 12, 2);
            $table->integer('days_worked');
            $table->integer('days_absent');
            $table->decimal('total_late_hours', 8, 2);
            $table->decimal('basic_pay', 12, 2);
            $table->decimal('premium', 12, 2);
            $table->decimal('total_deductions', 12, 2);
            $table->decimal('net_pay', 12, 2);
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
