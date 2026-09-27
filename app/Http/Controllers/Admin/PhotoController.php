<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PhotoRequest;
use App\Models\Photo;
use App\Support\CacheInvalidator;
use App\Support\LogoImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PhotoController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Photo::class);

        // This cPanel plan has no SSH. Create pending schema on the first
        // authenticated visit so the CMS module can be deployed via FTP.
        if (! Schema::hasTable('photos')) {
            Artisan::call('migrate', ['--force' => true]);
        }

        return Inertia::render('admin/photos/index', [
            'photos' => Photo::ordered()->get()->toArray(),
        ]);
    }

    public function store(PhotoRequest $request): RedirectResponse
    {
        $photo = new Photo(['sort_order' => (int) Photo::max('sort_order') + 1]);
        $this->save($photo, $request);

        return back()->with('success', 'Foto ditambahkan ke galeri.');
    }

    public function update(PhotoRequest $request, Photo $photo): RedirectResponse
    {
        $this->save($photo, $request);

        return back()->with('success', 'Foto diperbarui.');
    }

    public function destroy(Photo $photo): RedirectResponse
    {
        $this->authorize('delete', $photo);
        Storage::disk('public')->delete($photo->image);
        $photo->delete();
        CacheInvalidator::publicContent();

        return back()->with('success', 'Foto dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', Photo::class);

        foreach ($request->validate(['order' => ['required', 'array']])['order'] as $index => $id) {
            Photo::whereKey($id)->update(['sort_order' => $index]);
        }
        CacheInvalidator::publicContent();

        return back();
    }

    private function save(Photo $photo, PhotoRequest $request): void
    {
        $data = $request->safe()->only(['title', 'caption', 'alt_text', 'is_published']);

        if ($request->hasFile('photo_file')) {
            if ($photo->image) {
                Storage::disk('public')->delete($photo->image);
            }
            $data['image'] = $request->file('photo_file')->store('photo-gallery', 'public');
            LogoImage::downscale($data['image'], 1600);
        }

        $photo->fill($data)->save();
        CacheInvalidator::publicContent();
    }
}
