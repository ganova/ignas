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
                'question' => 'How long does one video take?',
                'answer' => 'Social media content: 2–3 business days. Commercials or company profiles: 1–2 weeks. Short documentaries: 2–4 weeks.',
                'is_open_by_default' => true,
            ],
            ['question' => 'How many revisions do I get?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'What file formats will I receive?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'Do you provide music & stock footage?', 'answer' => null, 'is_open_by_default' => false],
            ['question' => 'How does payment work?', 'answer' => null, 'is_open_by_default' => false],
        ];

        foreach ($items as $i => $item) {
            // Matched on sort_order, not question: the question text has
            // already been translated once (Indonesian -> English), and
            // matching on it would silently create a second, duplicate row
            // per FAQ instead of updating the existing one — the same class
            // of bug fixed in PortfolioSeeder's slug matching.
            Faq::updateOrCreate(
                ['sort_order' => $i],
                array_merge($item, ['is_published' => true])
            );
        }
    }
}
