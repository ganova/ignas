<?php

use App\Models\Faq;
use App\Models\Portfolio;

it('shows desktop layout and filters portfolio without reload', function () {
    Portfolio::factory()->create(['title' => 'Alpha Project', 'platform' => 'tiktok', 'is_published' => true, 'published_at' => now()]);
    Portfolio::factory()->create(['title' => 'Beta Project', 'platform' => 'youtube', 'is_published' => true, 'published_at' => now()]);

    $page = visit('/')->resize(1280, 900);

    $page->assertSee('Alpha Project')->assertSee('Beta Project');

    $page->click('TikTok');
    $page->assertSee('Alpha Project')->assertDontSee('Beta Project');
});

it('opens the qna accordion on click', function () {
    Faq::factory()->create(['question' => 'Apakah ini FAQ?', 'answer' => 'Ya, ini FAQ.', 'is_open_by_default' => false]);

    $page = visit('/');

    $page->click('Apakah ini FAQ?');
    $page->assertSee('Ya, ini FAQ.');
});

it('renders correctly at mobile width without horizontal overflow', function () {
    $page = visit('/')->resize(390, 844);

    $page->assertSee('Footage kamu udah bagus');
});
