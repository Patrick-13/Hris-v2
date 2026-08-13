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
        Schema::create('travel_orders', function (Blueprint $table) {
            $table->id();
            $table->string('travel_id')->unique();
            $table->string('employee_id');
            $table->string('employee_name');
            $table->string('employee_division')->nullable();
            $table->string('employee_section')->nullable();
            $table->string('employee_designation')->nullable();
            $table->string('travel_scope')->nullable();
            $table->string('travel_type')->nullable();
            $table->date('travel_applied_date')->nullable();
            $table->date('travel_departure_date')->nullable();
            $table->date('travel_return_date')->nullable();
            $table->text('travel_official_station')->nullable();
            $table->text('travel_destination')->nullable();
            $table->text('travel_purpose')->nullable();
            $table->text('travel_pier_diem')->nullable();
            $table->text('travel_assistant')->nullable();
            $table->text('travel_remarks')->nullable();
            $table->date('travel_report_submission')->nullable();
            $table->string('travel_application_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_orders');
    }
};
