<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use League\Flysystem\PathTraversalDetected;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Serves public-disk uploads (brand logos, tool icons, portfolio videos) at
 * /storage/{path}. On shared hosting there's no `storage:link` symlink in the
 * web root, so these requests fall through to Laravel; when a symlink does
 * exist the web server answers first and this never runs.
 */
class PublicFileController extends Controller
{
    public function __invoke(string $path): StreamedResponse
    {
        $disk = Storage::disk('public');

        try {
            abort_unless($disk->exists($path), 404);
        } catch (PathTraversalDetected) {
            abort(404);
        }

        return $disk->response($path, null, [
            'Cache-Control' => 'public, max-age=2592000',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
