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
        Schema::create('training_files', function (Blueprint $table) {
            $table->id();

            // employee_id might be string (if EMP001 format)
            $table->string('employee_id');

            // match this to the parent table type (unsignedBigInteger)
            $table->unsignedBigInteger('training_id');

            // foreign key constraints
            $table->foreign('employee_id')
                ->references('employee_id')
                ->on('personnel_employees')
                ->onDelete('cascade');

            $table->foreign('training_id')
                ->references('id') // or 'training_id' if you used id('training_id')
                ->on('personnel_trainings')
                ->onDelete('cascade');

            $table->string('ilrFile')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_files', function (Blueprint $table) {
            // ✅ Drop FKs first before dropping the table
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['training_id']);
        });

        Schema::dropIfExists('training_files');
    }
};
