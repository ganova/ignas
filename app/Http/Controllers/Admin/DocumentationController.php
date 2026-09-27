<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    public function __invoke(): Response
    {
        $this->authorize('viewAny', Portfolio::class);

        return Inertia::render('admin/documentation/index');
    }
}
