<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Portfolio;
use App\Models\ProcessStep;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $payload = Cache::remember(CacheInvalidator::PUBLIC_HOME_KEY, now()->addHour(), function () {
            $settings = SiteSetting::allGroups();
            $settings['seo']['indexing_enabled'] = SiteSetting::indexingEnabled();

            return [
                'settings' => $settings,
                'whatsappUrl' => SiteSetting::whatsappUrl(),
                // ->toArray() here, not just a Collection: passing raw Eloquent
                // Collections through cache + Inertia's prop serialization has
                // been observed to lose the class on unserialize and render as
                // {"__PHP_Incomplete_Class_Name": ...} client-side. Plain
                // arrays survive any serialize/json_encode path intact.
                'portfolios' => Portfolio::published()->ordered()->get([
                    'id', 'title', 'slug', 'platform', 'category', 'duration',
                    'views_label', 'thumbnail', 'gradient_from', 'gradient_to', 'external_url', 'is_featured',
                ])->toArray(),
                'services' => Service::published()->ordered()->get(['number', 'title', 'description'])->toArray(),
                'processSteps' => ProcessStep::published()->ordered()->get(['step_number', 'label', 'title', 'description'])->toArray(),
                'faqs' => Faq::published()->ordered()->get(['id', 'question', 'answer', 'is_open_by_default'])->toArray(),
            ];
        });

        return Inertia::render('public/home', $payload);
    }
}
