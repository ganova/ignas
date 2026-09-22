<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function edit(): Response
    {
        $this->authorize('view', SiteSetting::class);

        return Inertia::render('admin/seo/index', [
            'seo' => SiteSetting::group('seo'),
            'environment' => app()->environment(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $validated = $request->validate([
            'default_site_title' => ['required', 'string', 'max:80'],
            'title_template' => ['required', 'string', 'max:80'],
            'default_meta_description' => ['required', 'string', 'max:200'],
            'default_og_image' => ['nullable', 'string', 'max:255'],
            'indexing_enabled' => ['boolean'],
        ]);

        SiteSetting::putGroup('seo', $validated);
        CacheInvalidator::publicContent();

        return back()->with('success', 'Pengaturan SEO disimpan.');
    }
}
