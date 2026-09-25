<?php

use App\Models\Brand;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());
});

it('creates a brand with an uploaded logo', function () {
    $this->post(route('admin.brands.store'), [
        'name' => 'Acme',
        'website_url' => 'https://acme.test',
        'logo_file' => UploadedFile::fake()->image('logo.png', 200, 80),
        'is_published' => true,
    ])->assertSessionHasNoErrors();

    $brand = Brand::sole();
    expect($brand->name)->toBe('Acme')->and($brand->logo)->not->toBeNull();
    Storage::disk('public')->assertExists($brand->logo);
});

it('rejects an svg logo', function () {
    $this->post(route('admin.brands.store'), [
        'name' => 'Evil',
        'logo_file' => UploadedFile::fake()->create('logo.svg', 4, 'image/svg+xml'),
    ])->assertSessionHasErrors('logo_file');

    expect(Brand::count())->toBe(0);
});

it('removes a brand logo from storage when asked', function () {
    $path = UploadedFile::fake()->image('old.png')->store('brand-logos', 'public');
    $brand = Brand::factory()->create(['logo' => $path]);

    $this->post(route('admin.brands.update', $brand), [
        'name' => $brand->name,
        'remove_logo' => true,
        'is_published' => true,
    ])->assertSessionHasNoErrors();

    expect($brand->fresh()->logo)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

it('reorders tools', function () {
    [$a, $b] = Tool::factory()->count(2)->create();

    $this->post(route('admin.tools.reorder'), ['order' => [$b->id, $a->id]])->assertRedirect();

    expect($b->fresh()->sort_order)->toBe(0)->and($a->fresh()->sort_order)->toBe(1);
});

it('shows only published brands and tools on the home page', function () {
    Brand::factory()->create(['name' => 'Visible Brand']);
    Brand::factory()->create(['name' => 'Hidden Brand', 'is_published' => false]);
    Tool::factory()->create(['name' => 'DaVinci Resolve']);
    Tool::factory()->create(['name' => 'Hidden Tool', 'is_published' => false]);

    auth()->logout();

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->has('brands', 1)
        ->where('brands.0.name', 'Visible Brand')
        ->has('tools', 1)
        ->where('tools.0.name', 'DaVinci Resolve'));
});

it('renders the admin brand and software pages', function () {
    Brand::factory()->create();
    Tool::factory()->create();

    $this->get(route('admin.brands.index'))->assertInertia(fn (Assert $page) => $page->component('admin/brands/index')->has('brands', 1));
    $this->get(route('admin.tools.index'))->assertInertia(fn (Assert $page) => $page->component('admin/tools/index')->has('tools', 1));
});
