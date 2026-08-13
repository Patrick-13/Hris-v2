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
        Schema::create('training_employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_id');
            $table->string('employee_id');
            // ✅ Corrected table name
            $table->foreign('training_id')->references('id')->on('personnel_trainings')->onDelete('cascade');
            $table->foreign('employee_id')->references('employee_id')->on('personnel_employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_employees');
    }
};
