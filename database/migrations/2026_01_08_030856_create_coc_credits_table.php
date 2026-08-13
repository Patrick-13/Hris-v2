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
        Schema::create('coc_credits', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->year('year');
            $table->decimal('entitled', 8, 2); // e.g. 120.00 hours
            $table->decimal('used', 8, 2)->default(0);
            $table->decimal('balance', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coc_credits');
    }
};
