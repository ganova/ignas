<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::create($request->validated());

        $recipient = SiteSetting::group('contact')['email'] ?? null;

        if ($recipient) {
            Mail::to($recipient)->send(new ContactMessageReceived($contactMessage));
        }

        return back()->with('success', "Thanks! I'll get back to you soon.");
    }
}
