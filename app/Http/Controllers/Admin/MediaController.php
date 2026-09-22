<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessUploadedMedia;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    private const MAX_KILOBYTES = 10240; // 10MB

    public function index(): Response
    {
        $this->authorize('viewAny', Media::class);

        return Inertia::render('admin/media/index', [
            'media' => Media::latest()->paginate(24)->toArray(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Media::class);

        $request->validate([
            'file' => [
                'required',
                'file',
                'mimetypes:'.implode(',', self::ALLOWED_MIME_TYPES),
                'max:'.self::MAX_KILOBYTES,
            ],
            'alt_text' => ['nullable', 'string', 'max:200'],
        ]);

        $file = $request->file('file');

        // SVG is intentionally excluded from ALLOWED_MIME_TYPES above: it can
        // carry embedded scripts and is not accepted without a sanitizer.
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $storedName = Str::uuid()->toString().'.'.$extension;
        $path = $file->storeAs('media', $storedName, 'public');

        $media = Media::create([
            'disk' => 'public',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'alt_text' => $request->string('alt_text')->toString() ?: null,
        ]);

        // Dimensions + responsive/WebP variants are generated off the request
        // thread so large uploads don't block the admin UI.
        ProcessUploadedMedia::dispatch($media);

        return back()->with('success', 'Media diunggah dan sedang diproses.');
    }

    public function update(Request $request, Media $media): RedirectResponse
    {
        $this->authorize('create', Media::class);

        $data = $request->validate(['alt_text' => ['nullable', 'string', 'max:200']]);
        $media->update($data);

        return back()->with('success', 'Alt text diperbarui.');
    }

    public function destroy(Media $media): RedirectResponse
    {
        $this->authorize('delete', $media);

        if ($media->isInUse()) {
            return back()->with('error', 'Media ini masih digunakan oleh konten lain dan tidak bisa dihapus.');
        }

        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return back()->with('success', 'Media dihapus.');
    }
}
