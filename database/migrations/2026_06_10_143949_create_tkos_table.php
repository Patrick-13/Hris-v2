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
        Schema::create('tkos', function (Blueprint $table) {
            $table->id();
            // employee_id might be string (if EMP001 format)
            $table->string('employee_id');
            // foreign key constraints
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');

            $table->enum('tko_type', ['timeIn', 'breakIn', 'breakOut', 'timeOut',]);
            $table->date('date');
            $table->time('tko_time');
            $table->string('attachment_file');
            $table->string('remarks')->nullable();
            $table->timestamps();


            $table->index(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tkos');
    }
};
