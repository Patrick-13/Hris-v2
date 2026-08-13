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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('sec_name');
            $table->string('sec_code')->nullable()->unique();
            $table->foreignId('div_id')->nullable()->constrained('divisions')->nullOnDelete();
            $table->string('sec_immediate_supervisor')->nullable();
            $table->foreign('sec_immediate_supervisor')
                ->references('employee_id')
                ->on('personnel_employees')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
