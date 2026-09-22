<?php

namespace Database\Seeders;

use App\Models\ProcessStep;
use Illuminate\Database\Seeder;

class ProcessStepSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'STEP 1', 'title' => 'Chat on WhatsApp', 'description' => 'Tell me about the video. A casual brief is fine.'],
            ['label' => 'STEP 2', 'title' => 'Pick a package', 'description' => 'I give you an upfront estimate on time and cost.'],
            ['label' => 'STEP 3', 'title' => 'Send your footage', 'description' => 'Via Google Drive. Work starts the same day.'],
            ['label' => 'STEP 4', 'title' => 'Review & revise', 'description' => 'Three rounds of revisions included.'],
        ];

        foreach ($items as $i => $item) {
            ProcessStep::updateOrCreate(
                ['step_number' => $i + 1],
                array_merge($item, ['is_published' => true, 'sort_order' => $i])
            );
        }
    }
}
