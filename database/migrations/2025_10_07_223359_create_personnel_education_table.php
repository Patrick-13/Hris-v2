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
        Schema::create('personnel_education', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->string('educationLevel')->nullable();
            $table->string('schoolName')->nullable();
            $table->string('degree')->nullable();
            $table->string('yeargraduate')->nullable();
            $table->string('highestlevel')->nullable();
            $table->string('unitsEarned')->nullable();
            $table->date('dateFrom')->nullable();
            $table->date('dateTo')->nullable();
            $table->string('scholarship_honors')->nullable();
            $table->string('isGraduated')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_education');
    }
};
