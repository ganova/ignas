<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioCategoryController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Portfolio::class);

        return Inertia::render('admin/portfolio-categories/index', [
            'categories' => collect($this->categories())
                ->map(fn (string $name, int $id) => ['id' => $id, 'name' => $name])
                ->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Portfolio::class);
        $name = $this->validatedName($request);
        $categories = $this->categories();

        if ($this->contains($categories, $name)) {
            return back()->withErrors(['name' => 'Kategori tersebut sudah tersedia.']);
        }

        $categories[] = $name;
        $this->save($categories);

        return back()->with('success', 'Kategori portfolio ditambahkan.');
    }

    public function update(Request $request, int $category): RedirectResponse
    {
        $this->authorize('create', Portfolio::class);
        $categories = $this->categories();
        abort_unless(array_key_exists($category, $categories), 404);
        $name = $this->validatedName($request);

        if ($this->contains(array_values(array_diff_key($categories, [$category => true])), $name)) {
            return back()->withErrors(['name' => 'Kategori tersebut sudah tersedia.']);
        }

        $oldName = $categories[$category];
        $categories[$category] = $name;
        $this->save($categories);
        Portfolio::where('category', $oldName)->update(['category' => $name]);
        CacheInvalidator::publicContent();

        return back()->with('success', 'Kategori portfolio diperbarui.');
    }

    public function destroy(int $category): RedirectResponse
    {
        $this->authorize('create', Portfolio::class);
        $categories = $this->categories();
        abort_unless(array_key_exists($category, $categories), 404);

        if (Portfolio::where('category', $categories[$category])->exists()) {
            return back()->with('error', 'Kategori masih dipakai oleh project. Pindahkan project terlebih dahulu.');
        }

        unset($categories[$category]);
        $this->save(array_values($categories));

        return back()->with('success', 'Kategori portfolio dihapus.');
    }

    /** @return array<int, string> */
    private function categories(): array
    {
        $configured = SiteSetting::group('portfolio')['categories'] ?? [];
        $existing = Portfolio::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->all();

        return collect([...$configured, ...$existing])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique(fn ($name) => mb_strtolower($name))
            ->values()
            ->all();
    }

    private function validatedName(Request $request): string
    {
        return trim($request->validate(['name' => ['required', 'string', 'max:80']])['name']);
    }

    /** @param array<int, string> $categories */
    private function contains(array $categories, string $name): bool
    {
        return collect($categories)->contains(fn (string $category) => strcasecmp($category, $name) === 0);
    }

    /** @param array<int, string> $categories */
    private function save(array $categories): void
    {
        $settings = SiteSetting::group('portfolio');
        $settings['categories'] = array_values($categories);
        SiteSetting::putGroup('portfolio', $settings);
        CacheInvalidator::publicContent();
    }
}
