<?php

use App\Models\Faq;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('creates a faq', function () {
    $this->post('/admin/faqs', [
        'question' => 'Bagaimana cara memesan?',
        'answer' => 'Chat WhatsApp dulu.',
    ])->assertRedirect();

    $this->assertDatabaseHas('faqs', ['question' => 'Bagaimana cara memesan?']);
});

it('only allows one faq to be open by default', function () {
    $first = Faq::factory()->create(['is_open_by_default' => true]);
    $second = Faq::factory()->create(['is_open_by_default' => false]);

    $this->put("/admin/faqs/{$second->id}", [
        'question' => $second->question,
        'answer' => $second->answer,
        'is_open_by_default' => true,
    ])->assertRedirect();

    expect($first->fresh()->is_open_by_default)->toBeFalse();
    expect($second->fresh()->is_open_by_default)->toBeTrue();
});

it('sanitizes script tags out of the answer', function () {
    $this->post('/admin/faqs', [
        'question' => 'Aman dari XSS?',
        'answer' => 'Halo <script>alert(1)</script> dunia',
    ])->assertRedirect();

    $faq = Faq::where('question', 'Aman dari XSS?')->first();

    expect($faq->answer)->not->toContain('<script>');
});

it('deletes a faq', function () {
    $faq = Faq::factory()->create();

    $this->delete("/admin/faqs/{$faq->id}")->assertRedirect();
    $this->assertSoftDeleted('faqs', ['id' => $faq->id]);
});
