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
        Schema::create('overtime_approval_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('overtime_id')
                ->constrained('personnel_overtimes')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('approver_id');

            $table->enum('level', [
                'section/unit',
                'division',
                'rd',
                'hr',
            ]);

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->index('approver_id');
            $table->index('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_approval_histories');
    }
};
