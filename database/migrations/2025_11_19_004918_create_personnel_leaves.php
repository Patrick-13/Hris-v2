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
        Schema::create('personnel_leaves', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->string('leave_type_id');
            $table->foreignId('activity_id')
                ->nullable() // Use foreignId for activity_id
                ->constrained('activities')    // This will reference the 'id' column of the 'activities' table by default
                ->onDelete('cascade');
            $table->string('leavespent');
            $table->string('reason');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('request_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_leaves');
    }
};
