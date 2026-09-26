<?php

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => Storage::fake('public'));

function portfolioPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Cover Test',
        'platform' => 'youtube',
        'gradient_from' => '#B9A9FF',
        'gradient_to' => '#8FC2FF',
        'video_source' => 'link',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'is_published' => true,
    ], $overrides);
}

it('stores an uploaded thumbnail and shows it on the home page', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('admin.portfolio.store'), portfolioPayload([
        'thumbnail_file' => UploadedFile::fake()->image('cover.jpg', 1600, 900),
    ]))->assertSessionHasNoErrors();

    $portfolio = Portfolio::sole();
    Storage::disk('public')->assertExists($portfolio->thumbnail);
    expect($portfolio->resolveThumbnailUrl())->toBe(Storage::disk('public')->url($portfolio->thumbnail));
});

it('keeps the thumbnail when the form is saved without a new file, and removes it on request', function () {
    $this->actingAs(User::factory()->create());
    $path = UploadedFile::fake()->image('cover.jpg')->store('portfolio-thumbnails', 'public');
    $portfolio = Portfolio::factory()->create(['thumbnail' => $path, 'video_source' => 'link']);

    $this->put(route('admin.portfolio.update', $portfolio), portfolioPayload(['title' => 'Renamed']))
        ->assertSessionHasNoErrors();
    expect($portfolio->fresh()->thumbnail)->toBe($path);

    $this->put(route('admin.portfolio.update', $portfolio), portfolioPayload(['remove_thumbnail' => true]))
        ->assertSessionHasNoErrors();
    expect($portfolio->fresh()->thumbnail)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

it('derives a cover from youtube and google drive links when no thumbnail is uploaded', function (string $url, string $expected) {
    $portfolio = Portfolio::factory()->make(['thumbnail' => null, 'video_source' => 'link', 'video_url' => $url]);

    expect($portfolio->resolveThumbnailUrl())->toBe($expected);
})->with([
    'youtube' => ['https://youtu.be/dQw4w9WgXcQ', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'],
    'youtube shorts' => ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'],
    'google drive' => ['https://drive.google.com/file/d/1o5omxhO0caPQDw_DgQ0GNrL8CM-eNCfP/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1o5omxhO0caPQDw_DgQ0GNrL8CM-eNCfP&sz=w1000'],
]);

it('sends the resolved cover url to the public home page', function () {
    Portfolio::factory()->create([
        'platform' => 'youtube', 'is_published' => true, 'published_at' => now(),
        'thumbnail' => null, 'video_source' => 'link', 'video_url' => 'https://youtu.be/dQw4w9WgXcQ',
    ]);

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->where('portfolios.0.thumbnail', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'));
});
