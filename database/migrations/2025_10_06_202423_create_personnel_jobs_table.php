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
        Schema::create('personnel_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->string('designation');
            $table->string('jobTitle');
            $table->string('employmentStatus');
            $table->string('jobCategory')->nullable();
            $table->string('subUnit')->nullable();
            $table->string('contractAttachement')->nullable();
            $table->date('startDate');
            $table->date('endDate')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_jobs');
    }
};
