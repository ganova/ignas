<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ContactMessage::class);

        return Inertia::render('admin/messages/index', [
            'messages' => ContactMessage::latestFirst()->get()->toArray(),
        ]);
    }

    public function markRead(ContactMessage $contactMessage): RedirectResponse
    {
        $this->authorize('update', $contactMessage);

        $contactMessage->update(['is_read' => ! $contactMessage->is_read]);

        return back();
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $this->authorize('delete', $contactMessage);

        $contactMessage->delete();

        return back()->with('success', 'Pesan dihapus.');
    }
}
