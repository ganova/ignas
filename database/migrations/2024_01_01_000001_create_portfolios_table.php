<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('platform'); // tiktok, instagram, youtube, commercial, other
            $table->string('category')->nullable();
            $table->string('duration')->nullable();
            $table->string('views_label')->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('poster')->nullable();
            $table->string('video_url')->nullable();
            $table->string('external_url')->nullable();
            $table->string('gradient_from', 16)->default('#B9A9FF');
            $table->string('gradient_to', 16)->default('#8FC2FF');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'published_at']);
            $table->index('sort_order');
            $table->index('platform');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
