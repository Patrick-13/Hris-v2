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
        Schema::create('leave_credits', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->foreignId('leave_type_id')->constrained()->onDelete('cascade');
            $table->year('year');
            $table->float('entitled'); // total 8 digits, 2 after the decimal
            $table->float('used')->default(0);
            $table->float('balance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_credits');
    }
};
