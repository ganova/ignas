<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Uploads/removes the showreel video file. Kept apart from the main settings
 * form so saving text settings never has to resend a 100 MB file.
 */
class ShowreelMediaController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $request->validate([
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:153600'],
        ]);

        $file = $request->file('video');
        $path = $file->storeAs('showreel', Str::uuid().'.'.$file->extension(), 'public');

        $this->replaceFile($path);

        return back()->with('success', 'Video showreel di-upload.');
    }

    public function destroy(): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $this->replaceFile(null);

        return back()->with('success', 'Video showreel dihapus.');
    }

    private function replaceFile(?string $path): void
    {
        $showreel = SiteSetting::group('showreel');

        if (! empty($showreel['video_file'])) {
            Storage::disk('public')->delete($showreel['video_file']);
        }

        SiteSetting::putGroup('showreel', array_merge($showreel, ['video_file' => $path]));
        CacheInvalidator::publicContent();
    }
}
