<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Service::class);

        return Inertia::render('admin/services/index', [
            'services' => Service::ordered()->get()->toArray(),
        ]);
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());
        CacheInvalidator::publicContent();

        return back()->with('success', 'Layanan ditambahkan.');
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());
        CacheInvalidator::publicContent();

        return back()->with('success', 'Layanan diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->authorize('delete', $service);

        $service->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'Layanan dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Service::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            Service::whereKey($id)->update(['sort_order' => $index]);
        }

        CacheInvalidator::publicContent();

        return back();
    }
}
