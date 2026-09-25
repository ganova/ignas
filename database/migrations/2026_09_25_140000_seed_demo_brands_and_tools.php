<?php

use App\Models\Brand;
use App\Models\Tool;
use App\Support\CacheInvalidator;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Placeholder rows so the new sections render on first deploy; the admin
     * replaces them. Same reasoning as seed_demo_content: the host runs
     * migrations but not seeders. Skipped in tests, and when rows exist.
     */
    public function up(): void
    {
        if (app()->environment('testing')) {
            return;
        }

        if (Brand::count() === 0) {
            foreach (['Aurora Skincare', 'Dusk Coffee Co.', 'Nusa Sneakers', 'Fintech X', 'Halo Bank', 'Wildwood School', 'Nusantara Flavors'] as $i => $name) {
                Brand::create(['name' => $name, 'sort_order' => $i]);
            }
        }

        if (Tool::count() === 0) {
            $tools = [
                ['Premiere Pro', 'Editing'],
                ['After Effects', 'Motion'],
                ['DaVinci Resolve', 'Color'],
                ['Final Cut Pro', 'Editing'],
                ['CapCut', 'Short-Form'],
                ['Photoshop', 'Design'],
            ];
            foreach ($tools as $i => [$name, $category]) {
                Tool::create(['name' => $name, 'category' => $category, 'sort_order' => $i]);
            }
        }

        CacheInvalidator::publicContent();
    }

    public function down(): void
    {
        //
    }
};
