<?php

use App\Models\Faq;
use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Inertia\Testing\AssertableInertia as Assert;

it('loads the public home page', function () {
    $this->get('/')->assertOk();
});

it('only shows published portfolio items', function () {
    Portfolio::factory()->create(['title' => 'Published Item', 'is_published' => true, 'published_at' => now()]);
    Portfolio::factory()->create(['title' => 'Draft Item', 'is_published' => false, 'published_at' => null]);

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page
            ->component('public/home')
            ->has('portfolios', 1)
            ->where('portfolios.0.title', 'Published Item'),
    );
});

it('renders the hero settings on the public page', function () {
    SiteSetting::putGroup('hero', array_merge(SiteSetting::defaults()['hero'], [
        'heading' => 'Custom heading here,',
    ]));

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page->where('settings.hero.heading', 'Custom heading here,'),
    );
});

it('builds the whatsapp url from sanitized number and message', function () {
    SiteSetting::putGroup('contact', array_merge(SiteSetting::defaults()['contact'], [
        'whatsapp_number' => '+62 812-3456-7890',
        'whatsapp_message' => 'Halo & terima kasih',
    ]));

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page->where(
            'whatsappUrl',
            'https://wa.me/6281234567890?text='.rawurlencode('Halo & terima kasih'),
        ),
    );
});

it('renders faq accordion data with only one default open', function () {
    Faq::factory()->create(['question' => 'Q1', 'is_open_by_default' => true, 'is_published' => true]);
    Faq::factory()->create(['question' => 'Q2', 'is_open_by_default' => false, 'is_published' => true]);

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page->has('faqs', 2),
    );
});

it('caches the home payload and clears it after a content update', function () {
    Portfolio::factory()->create(['is_published' => true, 'published_at' => now()]);
    $this->get('/');

    expect(Cache::has(CacheInvalidator::PUBLIC_HOME_KEY))->toBeTrue();

    CacheInvalidator::publicContent();

    expect(Cache::has(CacheInvalidator::PUBLIC_HOME_KEY))->toBeFalse();
});

it('renders seo metadata', function () {
    $response = $this->get('/');

    $response->assertInertia(fn (Assert $page) => $page->has('settings.seo.default_meta_description'));
});
