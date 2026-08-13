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
        Schema::create('personnel_employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('lastname');
            $table->string('firstname');
            $table->string('middlename')->nullable();
            $table->string('nickname')->nullable();
            $table->string('email');
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed']);
            $table->string('citizenship');
            $table->float('weight')->nullable();
            $table->float('height')->nullable();
            $table->string('bloodtype')->nullable();
            $table->string('gsis')->nullable();
            $table->string('pagibig_number')->nullable();
            $table->string('sss_number')->nullable();
            $table->string('philhealth_number')->nullable();
            $table->date('date_hired');
            $table->boolean('emp_status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_employees');
    }
};
