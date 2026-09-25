<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ToolRequest;
use App\Models\Tool;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ToolController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Tool::class);

        return Inertia::render('admin/tools/index', [
            'tools' => Tool::ordered()->get()->toArray(),
        ]);
    }

    public function store(ToolRequest $request): RedirectResponse
    {
        $tool = new Tool(['sort_order' => (int) Tool::max('sort_order') + 1]);
        $this->save($tool, $request);

        return back()->with('success', 'Software ditambahkan.');
    }

    public function update(ToolRequest $request, Tool $tool): RedirectResponse
    {
        $this->save($tool, $request);

        return back()->with('success', 'Software diperbarui.');
    }

    public function destroy(Tool $tool): RedirectResponse
    {
        $this->authorize('delete', $tool);

        if ($tool->icon) {
            Storage::disk('public')->delete($tool->icon);
        }
        $tool->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'Software dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Tool::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            Tool::whereKey($id)->update(['sort_order' => $index]);
        }
        CacheInvalidator::publicContent();

        return back();
    }

    private function save(Tool $tool, ToolRequest $request): void
    {
        $data = $request->safe()->only(['name', 'category', 'is_published']);

        if ($request->hasFile('icon_file') || $request->boolean('remove_icon')) {
            if ($tool->icon) {
                Storage::disk('public')->delete($tool->icon);
            }
            $data['icon'] = $request->hasFile('icon_file')
                ? $request->file('icon_file')->store('tool-icons', 'public')
                : null;
        }

        $tool->fill($data)->save();
        CacheInvalidator::publicContent();
    }
}
