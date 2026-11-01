<?php

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());
});

it('uploads a showreel video and exposes its url on the home page', function () {
    $this->post(route('admin.settings.showreel-video.store'), [
        'video' => UploadedFile::fake()->create('reel.mp4', 2048, 'video/mp4'),
    ])->assertSessionHasNoErrors();

    $path = SiteSetting::group('showreel')['video_file'];
    Storage::disk('public')->assertExists($path);

    auth()->logout();
    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->where('settings.showreel.video_file_url', Storage::disk('public')->url($path)));
});

it('rejects a non-video showreel upload', function () {
    $this->post(route('admin.settings.showreel-video.store'), [
        'video' => UploadedFile::fake()->create('reel.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors('video');
});

it('keeps the uploaded showreel when other settings are saved, and deletes it on removal', function () {
    $this->post(route('admin.settings.showreel-video.store'), [
        'video' => UploadedFile::fake()->create('reel.mp4', 1024, 'video/mp4'),
    ]);
    $path = SiteSetting::group('showreel')['video_file'];

    $settings = SiteSetting::allGroups();
    $settings['showreel']['video_file'] = null;
    $settings['showreel']['video_url'] = 'https://drive.google.com/file/d/abc123/view';
    $this->put(route('admin.settings.update'), $settings)->assertSessionHasNoErrors();

    expect(SiteSetting::group('showreel')['video_file'])->toBe($path)
        ->and(SiteSetting::group('showreel')['video_url'])->toBe('https://drive.google.com/file/d/abc123/view');

    $this->delete(route('admin.settings.showreel-video.destroy'))->assertRedirect();

    expect(SiteSetting::group('showreel')['video_file'])->toBeNull();
    Storage::disk('public')->assertMissing($path);
});
