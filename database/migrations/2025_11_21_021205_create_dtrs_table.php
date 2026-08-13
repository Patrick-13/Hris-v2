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
        Schema::create('dtrs', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->date('punch_date')->nullable();
            $table->time('timeIn')->nullable();
            $table->time('breakOut')->nullable();
            $table->time('breakIn')->nullable();
            $table->time('timeOut')->nullable();
            $table->time('tardiness')->nullable();
            $table->time('undertime')->nullable();
            $table->time('overtime')->nullable();
            $table->time('total_hours')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dtrs');
    }
};
