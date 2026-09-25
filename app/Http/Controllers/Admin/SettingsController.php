<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $this->authorize('view', SiteSetting::class);

        return Inertia::render('admin/settings/index', [
            'settings' => SiteSetting::allGroups(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $validated = $request->validate([
            'identity' => ['required', 'array'],
            'identity.portfolio_name' => ['required', 'string', 'max:80'],
            'identity.owner_name' => ['required', 'string', 'max:80'],
            'identity.profession' => ['required', 'string', 'max:120'],
            'identity.copyright' => ['required', 'string', 'max:160'],
            'identity.location' => ['nullable', 'string', 'max:120'],
            'identity.logo_text' => ['required', 'string', 'max:60'],
            'identity.bio_paragraph_1' => ['required', 'string', 'max:400'],
            'identity.bio_paragraph_2' => ['required', 'string', 'max:400'],

            'hero' => ['required', 'array'],
            'hero.availability_text' => ['required', 'string', 'max:80'],
            'hero.availability_active' => ['boolean'],
            'hero.heading' => ['required', 'string', 'max:120'],
            'hero.heading_gradient' => ['required', 'string', 'max:60'],
            'hero.heading_suffix' => ['required', 'string', 'max:60'],
            'hero.description' => ['required', 'string', 'max:400'],
            'hero.primary_button_label' => ['required', 'string', 'max:40'],
            'hero.showreel_button_label' => ['required', 'string', 'max:40'],
            'hero.stats' => ['required', 'array', 'size:3'],
            'hero.stats.*.value' => ['required', 'string', 'max:20'],
            'hero.stats.*.label' => ['required', 'string', 'max:40'],

            'showreel' => ['required', 'array'],
            'showreel.title' => ['required', 'string', 'max:60'],
            'showreel.duration' => ['required', 'string', 'max:20'],
            'showreel.video_url' => ['nullable', 'url', 'max:255'],
            'showreel.poster' => ['nullable', 'string', 'max:255'],
            'showreel.is_published' => ['boolean'],
            'showreel.autoplay' => ['boolean'],

            'contact' => ['required', 'array'],
            'contact.whatsapp_number' => ['nullable', 'string', 'max:20'],
            'contact.whatsapp_message' => ['nullable', 'string', 'max:300'],
            'contact.email' => ['nullable', 'email', 'max:120'],
            'contact.instagram' => ['nullable', 'url', 'max:255'],
            'contact.youtube' => ['nullable', 'url', 'max:255'],
            'contact.behance' => ['nullable', 'url', 'max:255'],
            'contact.tiktok' => ['nullable', 'url', 'max:255'],

            'cta' => ['required', 'array'],
            'cta.heading' => ['required', 'string', 'max:160'],
            'cta.description' => ['required', 'string', 'max:300'],
            'cta.whatsapp_button_label' => ['required', 'string', 'max:40'],
            'cta.email_button_label' => ['required', 'string', 'max:40'],
            'cta.sticky_bar_text' => ['required', 'string', 'max:80'],

            'portfolio' => ['sometimes', 'array'],
            'portfolio.short_form_limit' => ['required_with:portfolio', 'integer', 'min:1', 'max:'.HomeController::HOME_PORTFOLIO_MAX],
            'portfolio.long_form_limit' => ['required_with:portfolio', 'integer', 'min:1', 'max:'.HomeController::HOME_PORTFOLIO_MAX],

            'visual' => ['required', 'array'],
            'visual.accent_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'visual.gradient' => ['required', 'string', 'max:255'],
            'visual.grain_enabled' => ['boolean'],
            'visual.blobs_enabled' => ['boolean'],
        ]);

        // Autoplay is force-disabled server-side regardless of admin input,
        // per the design requirement that the showreel never autoplays.
        $validated['showreel']['autoplay'] = false;

        if (isset($validated['portfolio'])) {
            $validated['portfolio'] = array_map('intval', $validated['portfolio']);
        }

        foreach ($validated as $group => $value) {
            SiteSetting::putGroup($group, $value);
        }

        CacheInvalidator::publicContent();

        return back()->with('success', 'Pengaturan disimpan.');
    }
}
