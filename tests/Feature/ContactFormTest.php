<?php

use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Mail;

it('stores a contact message when the mail server is unavailable', function () {
    SiteSetting::putGroup('contact', array_merge(SiteSetting::defaults()['contact'], [
        'email' => 'owner@example.com',
    ]));

    Mail::shouldReceive('to')
        ->once()
        ->with('owner@example.com')
        ->andThrow(new \RuntimeException('SMTP unavailable'));

    $response = $this->post('/contact', [
        'name' => 'Prospective Client',
        'email' => 'client@example.com',
        'whatsapp' => '628123456789',
        'message' => 'I would like to discuss a video project.',
    ]);

    $response->assertRedirect()->assertSessionHas('success');
    expect(ContactMessage::query()->where('email', 'client@example.com')->exists())->toBeTrue();
});
