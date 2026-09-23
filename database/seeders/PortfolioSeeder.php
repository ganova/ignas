<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Aurora Skincare', 'platform' => 'tiktok', 'duration' => '00:38', 'views_label' => '1.2M', 'category' => 'Commercial', 'gradient_from' => '#B9A9FF', 'gradient_to' => '#8FC2FF'],
            ['title' => 'Dusk Coffee Co.', 'platform' => 'instagram', 'duration' => '00:45', 'views_label' => '860K', 'category' => 'Brand Story', 'gradient_from' => '#FFD79B', 'gradient_to' => '#FFAECF'],
            ['title' => '"Homebound"', 'platform' => 'youtube', 'duration' => '08:12', 'views_label' => '412K', 'category' => 'Short Film', 'gradient_from' => '#A8E4FF', 'gradient_to' => '#C5B6FF'],
            ['title' => 'Nusa Sneakers', 'platform' => 'tiktok', 'duration' => '00:30', 'views_label' => '2.4M', 'category' => 'Reels Series', 'gradient_from' => '#FFC9D8', 'gradient_to' => '#C0B4FF'],
            ['title' => 'Fintech X', 'platform' => 'instagram', 'duration' => '02:05', 'views_label' => '530K', 'category' => 'Explainer', 'gradient_from' => '#BFF0DC', 'gradient_to' => '#9EC8FF'],
            ['title' => 'Wildwood School', 'platform' => 'youtube', 'duration' => '03:40', 'views_label' => '198K', 'category' => 'Documentary', 'gradient_from' => '#FFE6A8', 'gradient_to' => '#B5B0FF'],
            ['title' => 'Halo Bank', 'platform' => 'tiktok', 'duration' => '00:52', 'views_label' => '1.8M', 'category' => 'Explainer', 'gradient_from' => '#C9B6FF', 'gradient_to' => '#8FE8DC'],
            ['title' => 'Nusantara Flavors', 'platform' => 'instagram', 'duration' => '00:28', 'views_label' => '740K', 'category' => 'Food Series', 'gradient_from' => '#FFBFA8', 'gradient_to' => '#FFD9F0'],
        ];

        foreach ($items as $i => $item) {
            // Match on the plain slug, not generateUniqueSlug(): that helper
            // is for admin-created portfolios and appends "-1", "-2", etc.
            // when the base slug is taken. On a re-run it's always taken (by
            // this seeder's own previous run), so it would return a
            // never-matching slug here and attempt a duplicate INSERT instead
            // of the intended UPDATE.
            $slug = Str::slug($item['title']);

            Portfolio::updateOrCreate(
                ['slug' => $slug],
                array_merge($item, [
                    'title' => $item['title'],
                    'slug' => $slug,
                    'is_published' => true,
                    'is_featured' => $i < 2,
                    'published_at' => now()->subDays(8 - $i),
                    'sort_order' => $i,
                ])
            );
        }
    }
}
