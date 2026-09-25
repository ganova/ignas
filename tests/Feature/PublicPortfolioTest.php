<?php

use App\Http\Controllers\HomeController;
use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\CacheInvalidator;
use Inertia\Testing\AssertableInertia as Assert;

it('lists every published portfolio item on the archive page', function () {
    Portfolio::factory()->count(11)->create([
        'is_published' => true,
        'published_at' => now(),
    ]);
    Portfolio::factory()->create(['title' => 'Draft Item', 'is_published' => false, 'published_at' => null]);

    $this->get(route('portfolio.index'))->assertInertia(
        fn (Assert $page) => $page
            ->component('public/portfolio')
            ->has('portfolios', 11),
    );
});

it('caps short-form and long-form items separately on the home page and exposes the full total', function () {
    Portfolio::factory()->count(HomeController::SHORT_FORM_LIMIT + 2)->create([
        'platform' => 'instagram', 'is_published' => true, 'published_at' => now(),
    ]);
    Portfolio::factory()->count(HomeController::LONG_FORM_LIMIT + 2)->create([
        'platform' => 'youtube', 'is_published' => true, 'published_at' => now(),
    ]);

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page
            ->has('portfolios', HomeController::SHORT_FORM_LIMIT + HomeController::LONG_FORM_LIMIT)
            ->where('portfolioTotal', HomeController::SHORT_FORM_LIMIT + HomeController::LONG_FORM_LIMIT + 4),
    );
});

it('uses the admin-configured short-form and long-form counts', function () {
    Portfolio::factory()->count(6)->create(['platform' => 'tiktok', 'is_published' => true, 'published_at' => now()]);
    Portfolio::factory()->count(6)->create(['platform' => 'youtube', 'is_published' => true, 'published_at' => now()]);
    SiteSetting::putGroup('portfolio', ['short_form_limit' => 3, 'long_form_limit' => 2]);
    CacheInvalidator::publicContent();

    $this->get('/')->assertInertia(fn (Assert $page) => $page->has('portfolios', 5));
});

it('rejects a home page portfolio count outside 1-48', function () {
    $this->actingAs(User::factory()->create());

    $settings = SiteSetting::allGroups();
    $settings['portfolio']['short_form_limit'] = 0;
    $settings['portfolio']['long_form_limit'] = 49;

    $this->put(route('admin.settings.update'), $settings)
        ->assertSessionHasErrors(['portfolio.short_form_limit', 'portfolio.long_form_limit']);
});

it('clears the cached archive payload after a content update', function () {
    $this->get(route('portfolio.index'));

    expect(Cache::has(CacheInvalidator::PUBLIC_PORTFOLIO_KEY))->toBeTrue();

    CacheInvalidator::publicContent();

    expect(Cache::has(CacheInvalidator::PUBLIC_PORTFOLIO_KEY))->toBeFalse();
});
