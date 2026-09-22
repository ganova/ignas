<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaqRequest;
use App\Models\Faq;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Faq::class);

        return Inertia::render('admin/faqs/index', [
            'faqs' => Faq::ordered()->get()->toArray(),
        ]);
    }

    public function store(FaqRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->enforceSingleDefaultOpen($data);

        Faq::create($data);
        CacheInvalidator::publicContent();

        return back()->with('success', 'FAQ ditambahkan.');
    }

    public function update(FaqRequest $request, Faq $faq): RedirectResponse
    {
        $data = $request->validated();
        $this->enforceSingleDefaultOpen($data, $faq->id);

        $faq->update($data);
        CacheInvalidator::publicContent();

        return back()->with('success', 'FAQ diperbarui.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $this->authorize('delete', $faq);

        $faq->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'FAQ dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Faq::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            Faq::whereKey($id)->update(['sort_order' => $index]);
        }

        CacheInvalidator::publicContent();

        return back();
    }

    /**
     * Only one FAQ may be open by default. Turning this one on turns every
     * other one off, inside a transaction so the invariant always holds.
     */
    private function enforceSingleDefaultOpen(array &$data, ?int $ignoreId = null): void
    {
        if (empty($data['is_open_by_default'])) {
            return;
        }

        DB::transaction(function () use ($ignoreId) {
            Faq::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->update(['is_open_by_default' => false]);
        });
    }
}
