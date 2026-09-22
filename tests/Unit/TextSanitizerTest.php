<?php

use App\Support\TextSanitizer;

it('strips disallowed tags but keeps the safe subset', function () {
    $dirty = '<p>Hello <script>alert(1)</script><strong>world</strong></p>';

    expect(TextSanitizer::sanitizeRichText($dirty))->toBe('<p>Hello <strong>world</strong></p>');
});

it('keeps only http/https links and adds safe rel/target', function () {
    $dirty = '<a href="javascript:alert(1)">click</a> <a href="https://example.com">safe</a>';

    $clean = TextSanitizer::sanitizeRichText($dirty);

    expect($clean)->toContain('<a>click</a>')
        ->and($clean)->toContain('href="https://example.com"')
        ->and($clean)->toContain('rel="noopener noreferrer nofollow"');
});

it('returns null for empty input', function () {
    expect(TextSanitizer::sanitizeRichText(''))->toBeNull();
    expect(TextSanitizer::sanitizeRichText(null))->toBeNull();
});
