<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioIndexController extends Controller
{
    public function __invoke(): Response
    {
        $payload = Cache::remember(CacheInvalidator::PUBLIC_PORTFOLIO_KEY, now()->addHour(), function () {
            $settings = SiteSetting::allGroups();
            $settings['seo']['indexing_enabled'] = SiteSetting::indexingEnabled();

            return [
                'settings' => $settings,
                'whatsappUrl' => SiteSetting::whatsappUrl(),
                'portfolios' => Portfolio::published()->ordered()->get([
                    'id', 'title', 'slug', 'platform', 'category', 'duration', 'views_label', 'description',
                    'thumbnail', 'gradient_from', 'gradient_to', 'external_url', 'is_featured', 'published_at', 'video_source', 'video_url', 'video_path',
                ])->map(fn (Portfolio $portfolio): Portfolio => $portfolio->presentForPublic())->toArray(),
            ];
        });

        return Inertia::render('public/portfolio', $payload);
    }
}
