<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Portfolio;
use App\Models\ProcessStep;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $recentlyUpdated = collect([
            Portfolio::query()->latest('updated_at')->take(5)->get(['title', 'updated_at'])
                ->map(fn ($m) => ['type' => 'Portfolio', 'title' => $m->title, 'updated_at' => $m->updated_at]),
            Service::query()->latest('updated_at')->take(5)->get(['title', 'updated_at'])
                ->map(fn ($m) => ['type' => 'Layanan', 'title' => $m->title, 'updated_at' => $m->updated_at]),
            ProcessStep::query()->latest('updated_at')->take(5)->get(['title', 'updated_at'])
                ->map(fn ($m) => ['type' => 'Proses', 'title' => $m->title, 'updated_at' => $m->updated_at]),
            Faq::query()->latest('updated_at')->take(5)->get(['question', 'updated_at'])
                ->map(fn ($m) => ['type' => 'QnA', 'title' => $m->question, 'updated_at' => $m->updated_at]),
        ])
            ->collapse()
            ->pipe(fn (Collection $items) => $items->sortByDesc('updated_at')->take(8)->values())
            ->toArray();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'portfolio_total' => Portfolio::count(),
                'portfolio_published' => Portfolio::where('is_published', true)->count(),
                'services_total' => Service::count(),
                'faqs_total' => Faq::count(),
                'showreel_published' => (bool) (SiteSetting::group('showreel')['is_published'] ?? false),
                'availability_active' => (bool) (SiteSetting::group('hero')['availability_active'] ?? false),
                'availability_text' => SiteSetting::group('hero')['availability_text'] ?? '',
            ],
            'recentlyUpdated' => $recentlyUpdated,
        ]);
    }
}
