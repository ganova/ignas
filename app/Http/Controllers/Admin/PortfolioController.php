<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioRequest;
use App\Models\Portfolio;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Portfolio::class);

        $portfolios = Portfolio::query()
            ->when($request->string('search')->toString(), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->string('platform')->toString(), fn ($q, $platform) => $q->where('platform', $platform))
            ->when($request->filled('status'), function ($q) use ($request) {
                $request->string('status')->toString() === 'published'
                    ? $q->where('is_published', true)
                    : $q->where('is_published', false);
            })
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/portfolio/index', [
            'portfolios' => $portfolios->toArray(),
            'platforms' => Portfolio::PLATFORMS,
            'filters' => $request->only(['search', 'platform', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Portfolio::class);

        return Inertia::render('admin/portfolio/form', [
            'platforms' => Portfolio::PLATFORMS,
        ]);
    }

    public function store(PortfolioRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Portfolio::generateUniqueSlug($data['slug'] ?? $data['title']);

        Portfolio::create($data);
        CacheInvalidator::publicContent();

        return to_route('admin.portfolio.index')->with('success', 'Project berhasil ditambahkan.');
    }

    public function edit(Portfolio $portfolio): Response
    {
        $this->authorize('update', $portfolio);

        return Inertia::render('admin/portfolio/form', [
            'portfolio' => $portfolio,
            'platforms' => Portfolio::PLATFORMS,
        ]);
    }

    public function update(PortfolioRequest $request, Portfolio $portfolio): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Portfolio::generateUniqueSlug($data['slug'] ?? $data['title'], $portfolio->id);

        $portfolio->update($data);
        CacheInvalidator::publicContent();

        return to_route('admin.portfolio.index')->with('success', 'Project berhasil diperbarui.');
    }

    public function destroy(Portfolio $portfolio): RedirectResponse
    {
        $this->authorize('delete', $portfolio);

        $portfolio->delete();
        CacheInvalidator::publicContent();

        return to_route('admin.portfolio.index')->with('success', 'Project dipindahkan ke trash.');
    }

    public function togglePublish(Portfolio $portfolio): RedirectResponse
    {
        $this->authorize('update', $portfolio);

        $publishing = ! $portfolio->is_published;
        $portfolio->update([
            'is_published' => $publishing,
            'published_at' => $publishing ? ($portfolio->published_at ?? now()) : $portfolio->published_at,
        ]);

        CacheInvalidator::publicContent();

        return back();
    }

    public function toggleFeatured(Portfolio $portfolio): RedirectResponse
    {
        $this->authorize('update', $portfolio);

        $portfolio->update(['is_featured' => ! $portfolio->is_featured]);
        CacheInvalidator::publicContent();

        return back();
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Portfolio::class);

        $ids = $request->validate(['order' => ['required', 'array']])['order'];

        foreach ($ids as $index => $id) {
            Portfolio::whereKey($id)->update(['sort_order' => $index]);
        }

        CacheInvalidator::publicContent();

        return back();
    }
}
