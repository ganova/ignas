<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Faq;
use App\Models\Portfolio;
use App\Models\ProcessStep;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Tool;
use App\Support\CacheInvalidator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public const SHORT_FORM_LIMIT = 12;

    public const LONG_FORM_LIMIT = 6;

    public const HOME_PORTFOLIO_MAX = 48;

    private const PORTFOLIO_COLUMNS = [
        'id', 'title', 'slug', 'platform', 'category', 'duration',
        'views_label', 'thumbnail', 'gradient_from', 'gradient_to', 'external_url', 'is_featured', 'video_source', 'video_url', 'video_path',
    ];

    public function __invoke(): Response
    {
        $payload = Cache::remember(CacheInvalidator::PUBLIC_HOME_KEY, now()->addHour(), function () {
            $settings = SiteSetting::allGroups();
            $settings['seo']['indexing_enabled'] = SiteSetting::indexingEnabled();
            $shortLimit = $this->clampLimit($settings['portfolio']['short_form_limit'] ?? self::SHORT_FORM_LIMIT);
            $longLimit = $this->clampLimit($settings['portfolio']['long_form_limit'] ?? self::LONG_FORM_LIMIT);

            $portfolios = Portfolio::published()->shortForm()->ordered()->limit($shortLimit)->get(self::PORTFOLIO_COLUMNS)
                ->concat(Portfolio::published()->longForm()->ordered()->limit($longLimit)->get(self::PORTFOLIO_COLUMNS))
                ->map(function (Portfolio $portfolio): Portfolio {
                    if ($portfolio->video_source === 'upload' && $portfolio->video_path) {
                        $portfolio->video_url = Storage::disk('public')->url($portfolio->video_path);
                    }

                    return $portfolio;
                });

            return [
                'settings' => $settings,
                'whatsappUrl' => SiteSetting::whatsappUrl(),
                // ->toArray() here, not just a Collection: passing raw Eloquent
                // Collections through cache + Inertia's prop serialization has
                // been observed to lose the class on unserialize and render as
                // {"__PHP_Incomplete_Class_Name": ...} client-side. Plain
                // arrays survive any serialize/json_encode path intact.
                'portfolios' => $portfolios->values()->toArray(),
                'portfolioTotal' => Portfolio::published()->count(),
                'services' => Service::published()->ordered()->get(['number', 'title', 'description'])->toArray(),
                'processSteps' => ProcessStep::published()->ordered()->get(['step_number', 'label', 'title', 'description'])->toArray(),
                'faqs' => Faq::published()->ordered()->get(['id', 'question', 'answer', 'is_open_by_default'])->toArray(),
                // The cPanel deploy uploads files over FTP and migrations run separately, so the
                // new code can briefly be live before these tables exist; hide the sections then
                // instead of taking the whole home page down.
                'brands' => Schema::hasTable('brands')
                    ? Brand::published()->ordered()->get(['id', 'name', 'logo', 'website_url'])->toArray()
                    : [],
                'tools' => Schema::hasTable('tools')
                    ? Tool::published()->ordered()->get(['id', 'name', 'icon', 'category'])->toArray()
                    : [],
            ];
        });

        return Inertia::render('public/home', $payload);
    }

    private function clampLimit(mixed $value): int
    {
        return max(1, min(self::HOME_PORTFOLIO_MAX, (int) $value));
    }
}
