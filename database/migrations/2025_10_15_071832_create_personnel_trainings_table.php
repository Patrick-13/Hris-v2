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
        Schema::create('personnel_trainings', function (Blueprint $table) {
            $table->id();
            $table->string('soNumber');
            $table->string('title');
            $table->date('dateFrom');
            $table->date('dateTo');
            $table->string('noofHours')->nullable();
            $table->enum('type', ['internal', 'external']);
            $table->string('venue')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_trainings');
    }
};
