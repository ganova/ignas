<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessStepRequest;
use App\Models\ProcessStep;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProcessStepController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ProcessStep::class);

        return Inertia::render('admin/process/index', [
            'steps' => ProcessStep::ordered()->get()->toArray(),
        ]);
    }

    public function store(ProcessStepRequest $request): RedirectResponse
    {
        ProcessStep::create($request->validated());
        CacheInvalidator::publicContent();

        return back()->with('success', 'Langkah ditambahkan.');
    }

    public function update(ProcessStepRequest $request, ProcessStep $processStep): RedirectResponse
    {
        $processStep->update($request->validated());
        CacheInvalidator::publicContent();

        return back()->with('success', 'Langkah diperbarui.');
    }

    public function destroy(ProcessStep $processStep): RedirectResponse
    {
        $this->authorize('delete', $processStep);

        $processStep->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'Langkah dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', ProcessStep::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            ProcessStep::whereKey($id)->update(['sort_order' => $index]);
        }

        CacheInvalidator::publicContent();

        return back();
    }
}
