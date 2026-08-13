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
        Schema::create('employee_deductions', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();

            $table->decimal('sss', 12, 2)->default(0);
            $table->decimal('philhealth', 12, 2)->default(0);
            $table->decimal('pagibig', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('union_fee', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_deductions');
    }
};
