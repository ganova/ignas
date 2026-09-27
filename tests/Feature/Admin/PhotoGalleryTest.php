<?php

use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());
});

it('creates a published gallery photo', function () {
    $this->post('/admin/photos', [
        'title' => 'Coffee Portrait',
        'caption' => 'Editorial frame',
        'photo_file' => UploadedFile::fake()->image('coffee.jpg', 900, 1200),
        'is_published' => true,
    ])->assertRedirect();

    $photo = Photo::firstOrFail();
    expect($photo->title)->toBe('Coffee Portrait')
        ->and($photo->is_published)->toBeTrue();
    Storage::disk('public')->assertExists($photo->image);
});

it('rejects a gallery item without an image', function () {
    $this->post('/admin/photos', ['title' => 'Missing Photo'])
        ->assertSessionHasErrors('photo_file');
});

it('only renders published gallery photos on the homepage', function () {
    Photo::factory()->create(['title' => 'Visible Photo', 'is_published' => true]);
    Photo::factory()->create(['title' => 'Hidden Photo', 'is_published' => false]);

    $this->get('/')->assertInertia(fn ($page) => $page
        ->has('photos', 1)
        ->where('photos.0.title', 'Visible Photo'));
});

it('deletes a gallery photo and its file', function () {
    Storage::disk('public')->put('photo-gallery/delete-me.jpg', 'image');
    $photo = Photo::factory()->create(['image' => 'photo-gallery/delete-me.jpg']);

    $this->delete("/admin/photos/{$photo->id}")->assertRedirect();

    $this->assertDatabaseMissing('photos', ['id' => $photo->id]);
    Storage::disk('public')->assertMissing('photo-gallery/delete-me.jpg');
});
