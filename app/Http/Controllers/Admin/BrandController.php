<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BrandRequest;
use App\Models\Brand;
use App\Support\CacheInvalidator;
use App\Support\LogoImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Brand::class);

        return Inertia::render('admin/brands/index', [
            'brands' => Brand::ordered()->get()->toArray(),
        ]);
    }

    public function store(BrandRequest $request): RedirectResponse
    {
        $brand = new Brand(['sort_order' => (int) Brand::max('sort_order') + 1]);
        $this->save($brand, $request);

        return back()->with('success', 'Brand ditambahkan.');
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->save($brand, $request);

        return back()->with('success', 'Brand diperbarui.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $this->authorize('delete', $brand);

        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'Brand dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Brand::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            Brand::whereKey($id)->update(['sort_order' => $index]);
        }
        CacheInvalidator::publicContent();

        return back();
    }

    private function save(Brand $brand, BrandRequest $request): void
    {
        $data = $request->safe()->only(['name', 'website_url', 'is_published']);

        if ($request->hasFile('logo_file') || $request->boolean('remove_logo')) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $data['logo'] = $request->hasFile('logo_file')
                ? $request->file('logo_file')->store('brand-logos', 'public')
                : null;
        }

        if (! empty($data['logo'])) {
            LogoImage::tidy($data['logo']);
        }

        $brand->fill($data)->save();
        CacheInvalidator::publicContent();
    }
}
