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
            ['title' => 'Aurora Skincare', 'platform' => 'tiktok', 'duration' => '00:38', 'views_label' => '1.2 jt', 'category' => 'Commercial', 'gradient_from' => '#B9A9FF', 'gradient_to' => '#8FC2FF'],
            ['title' => 'Kopi Senja', 'platform' => 'instagram', 'duration' => '00:45', 'views_label' => '860 rb', 'category' => 'Brand Story', 'gradient_from' => '#FFD79B', 'gradient_to' => '#FFAECF'],
            ['title' => '"Pulang"', 'platform' => 'youtube', 'duration' => '08:12', 'views_label' => '412 rb', 'category' => 'Short Film', 'gradient_from' => '#A8E4FF', 'gradient_to' => '#C5B6FF'],
            ['title' => 'Nusa Sneakers', 'platform' => 'tiktok', 'duration' => '00:30', 'views_label' => '2.4 jt', 'category' => 'Reels Series', 'gradient_from' => '#FFC9D8', 'gradient_to' => '#C0B4FF'],
            ['title' => 'Fintech X', 'platform' => 'instagram', 'duration' => '02:05', 'views_label' => '530 rb', 'category' => 'Explainer', 'gradient_from' => '#BFF0DC', 'gradient_to' => '#9EC8FF'],
            ['title' => 'Sekolah Alam', 'platform' => 'youtube', 'duration' => '03:40', 'views_label' => '198 rb', 'category' => 'Dokumenter', 'gradient_from' => '#FFE6A8', 'gradient_to' => '#B5B0FF'],
            ['title' => 'Halo Bank', 'platform' => 'tiktok', 'duration' => '00:52', 'views_label' => '1.8 jt', 'category' => 'Explainer', 'gradient_from' => '#C9B6FF', 'gradient_to' => '#8FE8DC'],
            ['title' => 'Rasa Nusantara', 'platform' => 'instagram', 'duration' => '00:28', 'views_label' => '740 rb', 'category' => 'Food Series', 'gradient_from' => '#FFBFA8', 'gradient_to' => '#FFD9F0'],
        ];

        foreach ($items as $i => $item) {
            Portfolio::updateOrCreate(
                ['slug' => Portfolio::generateUniqueSlug($item['title'])],
                array_merge($item, [
                    'title' => $item['title'],
                    'slug' => Str::slug($item['title']),
                    'is_published' => true,
                    'is_featured' => $i < 2,
                    'published_at' => now()->subDays(8 - $i),
                    'sort_order' => $i,
                ])
            );
        }
    }
}
