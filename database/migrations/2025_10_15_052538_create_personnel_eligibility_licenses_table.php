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
        Schema::create('personnel_eligibility_licenses', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->string('cse')->nullable();
            $table->string('rating')->nullable();
            $table->string('placeExamTaken')->nullable();
            $table->date('dateTaken')->nullable();
            $table->string('profLicenseNumber')->nullable();
            $table->date('dateRelease')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_eligibility_licenses');
    }
};
