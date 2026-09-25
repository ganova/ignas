<?php

use App\Models\Portfolio;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('lists portfolio in the admin', function () {
    Portfolio::factory()->count(2)->create();

    $this->get('/admin/portfolio')->assertOk();
});

it('creates a portfolio item with server-side validation', function () {
    $this->post('/admin/portfolio', [
        'title' => 'New Project',
        'platform' => 'tiktok',
        'gradient_from' => '#B9A9FF',
        'gradient_to' => '#8FC2FF',
        'video_source' => 'link',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ])->assertRedirect('/admin/portfolio');

    $this->assertDatabaseHas('portfolios', ['title' => 'New Project', 'slug' => 'new-project']);
});

it('rejects a portfolio without a title', function () {
    $this->post('/admin/portfolio', ['platform' => 'tiktok'])->assertSessionHasErrors('title');
});

it('generates a unique slug when titles collide', function () {
    Portfolio::factory()->create(['title' => 'Aurora Skincare', 'slug' => 'aurora-skincare']);

    $this->post('/admin/portfolio', [
        'title' => 'Aurora Skincare',
        'platform' => 'tiktok',
        'gradient_from' => '#B9A9FF',
        'gradient_to' => '#8FC2FF',
        'video_source' => 'link',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ]);

    $this->assertDatabaseHas('portfolios', ['slug' => 'aurora-skincare-1']);
});

it('updates a portfolio item', function () {
    $portfolio = Portfolio::factory()->create(['title' => 'Old Title']);

    $this->put("/admin/portfolio/{$portfolio->id}", [
        'title' => 'Updated Title',
        'platform' => $portfolio->platform,
        'gradient_from' => $portfolio->gradient_from,
        'gradient_to' => $portfolio->gradient_to,
        'video_source' => 'link',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ])->assertRedirect('/admin/portfolio');

    expect($portfolio->fresh()->title)->toBe('Updated Title');
});

it('soft deletes a portfolio item and can restore it', function () {
    $portfolio = Portfolio::factory()->create();

    $this->delete("/admin/portfolio/{$portfolio->id}")->assertRedirect();

    $this->assertSoftDeleted('portfolios', ['id' => $portfolio->id]);

    $portfolio->restore();
    $this->assertDatabaseHas('portfolios', ['id' => $portfolio->id, 'deleted_at' => null]);
});

it('toggles publish state', function () {
    $portfolio = Portfolio::factory()->create(['is_published' => false]);

    $this->patch("/admin/portfolio/{$portfolio->id}/toggle-publish")->assertRedirect();

    expect($portfolio->fresh()->is_published)->toBeTrue();
});
