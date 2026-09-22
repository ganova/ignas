<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Edit dari footage mentah', 'description' => 'Dari rekaman apa adanya jadi video utuh: struktur, ritme, warna, dan suara.'],
            ['title' => 'Potong long form', 'description' => 'Podcast atau webinar panjang dipotong jadi klip pendek siap tayang.'],
            ['title' => 'Subtitle & motion text', 'description' => 'Teks bergerak yang rapi, terbaca, dan sesuai gaya brand kamu.'],
            ['title' => 'Paket konten bulanan', 'description' => 'Jadwal tetap tiap bulan dengan gaya visual yang konsisten.'],
        ];

        foreach ($items as $i => $item) {
            Service::updateOrCreate(
                ['number' => $i + 1],
                array_merge($item, ['is_published' => true, 'sort_order' => $i])
            );
        }
    }
}
