<?php

use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('manages portfolio category master data', function () {
    $this->post('/admin/portfolio-categories', [
        'name' => 'Tutorial',
    ])->assertRedirect();

    $portfolio = Portfolio::factory()->create(['category' => 'Tutorial']);

    $categories = SiteSetting::group('portfolio')['categories'];
    $category = array_search('Tutorial', $categories, true);

    $this->put("/admin/portfolio-categories/{$category}", [
        'name' => 'Interview',
    ])->assertRedirect();

    expect($portfolio->fresh()->category)->toBe('Interview');
});

it('does not delete a category that is still used', function () {
    SiteSetting::putGroup('portfolio', ['short_form_limit' => 12, 'long_form_limit' => 6, 'categories' => ['Review']]);
    Portfolio::factory()->create(['category' => 'Review']);

    $this->delete('/admin/portfolio-categories/0')
        ->assertSessionHas('error');

    expect(SiteSetting::group('portfolio')['categories'])->toContain('Review');
});

it('rejects a portfolio category outside the master list', function () {
    $this->post('/admin/portfolio', [
        'title' => 'Unstandardized Project',
        'platform' => 'tiktok',
        'category' => 'Random Typo',
        'video_source' => 'link',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ])->assertSessionHasErrors('category');
});
