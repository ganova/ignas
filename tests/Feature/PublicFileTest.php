<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => Storage::fake('public'));

it('serves an uploaded public file at its storage url', function () {
    $path = UploadedFile::fake()->image('logo.png')->store('brand-logos', 'public');

    $this->get(Storage::disk('public')->url($path))
        ->assertOk()
        ->assertHeader('Content-Type', 'image/png');
});

it('returns 404 for missing files and path traversal attempts', function () {
    $this->get('/storage/brand-logos/missing.png')->assertNotFound();
    $this->get('/storage/../.env')->assertNotFound();
    $this->get('/storage/brand-logos/%2e%2e/%2e%2e/.env')->assertNotFound();
});
