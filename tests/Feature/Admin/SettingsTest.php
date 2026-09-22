<?php

use App\Models\SiteSetting;
use App\Models\User;
use App\Support\CacheInvalidator;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('updates site settings and forces autoplay off', function () {
    $payload = SiteSetting::defaults();
    $payload['showreel']['autoplay'] = true; // attempt to force it on
    $payload['hero']['heading'] = 'Judul baru,';

    $this->put('/admin/settings', $payload)->assertRedirect();

    expect(SiteSetting::group('showreel')['autoplay'])->toBeFalse();
    expect(SiteSetting::group('hero')['heading'])->toBe('Judul baru,');
});

it('invalidates the public cache after settings are updated', function () {
    Cache::put(CacheInvalidator::PUBLIC_HOME_KEY, ['stale' => true]);

    $this->put('/admin/settings', SiteSetting::defaults())->assertRedirect();

    expect(Cache::has(CacheInvalidator::PUBLIC_HOME_KEY))->toBeFalse();
});
