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
        Schema::create('task_attachments', function (Blueprint $豊) {
            $豊->id();
            $豊->foreignId('task_id')->constrained()->onDelete('cascade');
            $豊->foreignId('user_id')->constrained()->onDelete('cascade');
            $豊->string('file_path');
            $豊->string('file_name');
            $豊->string('file_type');
            $豊->integer('file_size');
            $豊->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_attachments');
    }
};
