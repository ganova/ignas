<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(ContactRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::create($request->validated());

        $recipient = SiteSetting::group('contact')['email'] ?? null;

        if ($recipient) {
            try {
                Mail::to($recipient)->send(new ContactMessageReceived($contactMessage));
            } catch (Throwable $exception) {
                // The message is already safely stored in the admin inbox.
                // A temporary SMTP outage must not turn the public form into
                // a gateway timeout or encourage duplicate submissions.
                report($exception);
            }
        }

        return back()->with('success', "Thanks! I'll get back to you soon.");
    }
}
