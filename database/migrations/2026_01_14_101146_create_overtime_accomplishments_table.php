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
        Schema::create('overtime_accomplishments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('overtime_id')
                ->constrained('personnelovertimes')
                ->cascadeOnDelete();
            $table->text('work_accomplished');
            $table->decimal('duration_hours', 5, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_accomplishments');
    }
};
