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
        Schema::create('leave_credit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();

            $table->foreignId('leave_type_id')
                ->constrained('leave_types')
                ->cascadeOnDelete();

            $table->year('year');
            $table->unsignedTinyInteger('month');

            $table->decimal('earned', 8, 3);
            $table->decimal('before_balance', 8, 3);
            $table->decimal('after_balance', 8, 3);

            $table->unsignedInteger('absent_days')->default(0);
            $table->unsignedInteger('half_days')->default(0);

            $table->decimal('tardiness_hours', 8, 2)->default(0);
            $table->decimal('undertime_hours', 8, 2)->default(0);
            $table->decimal('late_hours', 8, 2)->default(0);

            // 10 hours = 1 day
            $table->decimal('late_equivalent_days', 8, 3)->default(0);

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_credit_logs');
    }
};
