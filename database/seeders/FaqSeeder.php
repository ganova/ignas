<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'question' => 'Berapa lama pengerjaan satu video?',
                'answer' => 'Konten social media 2–3 hari kerja. Commercial atau company profile 1–2 minggu. Dokumenter pendek 2–4 minggu.',
                'is_open_by_default' => true,
            ],
            ['question' => 'Berapa kali revisi yang saya dapat?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'Format file apa saja yang saya terima?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'Apakah menyediakan musik & stock footage?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'Bagaimana sistem pembayarannya?', 'answer' => null, 'is_open_by_default' => false],
        ];

        foreach ($items as $i => $item) {
            Faq::updateOrCreate(
                ['question' => $item['question']],
                array_merge($item, ['is_published' => true, 'sort_order' => $i])
            );
        }
    }
}
