<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Raw footage editing', 'description' => 'From unedited clips to a complete video: structure, pacing, color, and sound.'],
            ['title' => 'Long-form repurposing', 'description' => 'Podcasts or long webinars cut into short, publish-ready clips.'],
            ['title' => 'Subtitles & motion text', 'description' => 'Clean, readable motion text that matches your brand style.'],
            ['title' => 'Monthly content package', 'description' => 'A steady monthly schedule with a consistent visual style.'],
        ];

        foreach ($items as $i => $item) {
            Service::updateOrCreate(
                ['number' => $i + 1],
                array_merge($item, ['is_published' => true, 'sort_order' => $i])
            );
        }
    }
}
