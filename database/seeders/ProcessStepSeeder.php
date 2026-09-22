<?php

namespace Database\Seeders;

use App\Models\ProcessStep;
use Illuminate\Database\Seeder;

class ProcessStepSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'LANGKAH 1', 'title' => 'Chat WhatsApp', 'description' => 'Ceritakan videonya. Brief santai pun cukup.'],
            ['label' => 'LANGKAH 2', 'title' => 'Pilih paket', 'description' => 'Saya kasih estimasi waktu dan biaya di depan.'],
            ['label' => 'LANGKAH 3', 'title' => 'Kirim footage', 'description' => 'Lewat Google Drive. Pengerjaan mulai hari itu juga.'],
            ['label' => 'LANGKAH 4', 'title' => 'Terima & revisi', 'description' => 'Tiga putaran revisi sudah termasuk.'],
        ];

        foreach ($items as $i => $item) {
            ProcessStep::updateOrCreate(
                ['step_number' => $i + 1],
                array_merge($item, ['is_published' => true, 'sort_order' => $i])
            );
        }
    }
}
