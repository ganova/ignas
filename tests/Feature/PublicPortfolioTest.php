<?php

use App\Http\Controllers\HomeController;
use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\CacheInvalidator;
use Inertia\Testing\AssertableInertia as Assert;

it('lists every published portfolio item on the archive page', function () {
    Portfolio::factory()->count(HomeController::HOME_PORTFOLIO_LIMIT + 3)->create([
        'is_published' => true,
        'published_at' => now(),
    ]);
    Portfolio::factory()->create(['title' => 'Draft Item', 'is_published' => false, 'published_at' => null]);

    $this->get(route('portfolio.index'))->assertInertia(
        fn (Assert $page) => $page
            ->component('public/portfolio')
            ->has('portfolios', HomeController::HOME_PORTFOLIO_LIMIT + 3),
    );
});

it('limits the home page portfolio and exposes the full total', function () {
    Portfolio::factory()->count(HomeController::HOME_PORTFOLIO_LIMIT + 3)->create([
        'is_published' => true,
        'published_at' => now(),
    ]);

    $this->get('/')->assertInertia(
        fn (Assert $page) => $page
            ->has('portfolios', HomeController::HOME_PORTFOLIO_LIMIT)
            ->where('portfolioTotal', HomeController::HOME_PORTFOLIO_LIMIT + 3),
    );
});

it('uses the admin-configured home page portfolio count', function () {
    Portfolio::factory()->count(10)->create(['is_published' => true, 'published_at' => now()]);
    SiteSetting::putGroup('portfolio', ['home_limit' => 4]);
    CacheInvalidator::publicContent();

    $this->get('/')->assertInertia(fn (Assert $page) => $page->has('portfolios', 4));
});

it('rejects a home page portfolio count outside 1-48', function () {
    $this->actingAs(User::factory()->create());

    $settings = SiteSetting::allGroups();
    $settings['portfolio']['home_limit'] = 0;

    $this->put(route('admin.settings.update'), $settings)->assertSessionHasErrors('portfolio.home_limit');
});

it('clears the cached archive payload after a content update', function () {
    $this->get(route('portfolio.index'));

    expect(Cache::has(CacheInvalidator::PUBLIC_PORTFOLIO_KEY))->toBeTrue();

    CacheInvalidator::publicContent();

    expect(Cache::has(CacheInvalidator::PUBLIC_PORTFOLIO_KEY))->toBeFalse();
});
