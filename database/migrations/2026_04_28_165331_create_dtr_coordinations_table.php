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
        Schema::create('dtr_coordinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dtr_id')
                ->constrained('dtrs')
                ->cascadeOnDelete();

            // Link to Employee
            $table->string('employee_id');
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->cascadeOnDelete();

            // Photo + GPS
            $table->string('photo_path')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Optional (recommended)
            $table->string('type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dtr_coordinations');
    }
};
