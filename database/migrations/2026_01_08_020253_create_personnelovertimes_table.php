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
        Schema::create('personnelovertimes', function (Blueprint $table) {
            $table->id();
            $table->date('date_of_request');
            $table->string('purpose_of_overtime');
            $table->string('justification');
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');
            $table->text('work_to_accomplished');
            $table->decimal('duration_hours', 5, 2);
            $table->date('date_of_overtime');
            $table->boolean('request_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnelovertimes');
    }
};
