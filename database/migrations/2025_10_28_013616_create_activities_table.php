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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('title_id')->nullable()->constrained('activity_types')->nullOnDelete();
            $table->string('soNumber');
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
        Schema::dropIfExists('activities');
    }
};
