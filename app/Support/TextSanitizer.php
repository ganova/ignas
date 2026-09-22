<?php

namespace App\Support;

class TextSanitizer
{
    /**
     * Allow only a minimal safe subset of HTML (paragraphs, line breaks,
     * emphasis and links with http/https hrefs) so FAQ answers can contain
     * simple formatting without becoming an XSS vector or "rich text soup".
     */
    public static function sanitizeRichText(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        // strip_tags() removes tags but leaves their inner text behind, so
        // <script>...</script> would leak its payload as plain text. Strip
        // those elements (and their content) outright first.
        $value = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $value) ?? $value;

        $allowed = '<p><br><strong><b><em><i><a>';
        $clean = strip_tags($value, $allowed);

        // Strip any attribute that is not a safe href, and neutralise javascript: URIs.
        $clean = preg_replace_callback('/<a\s+([^>]*)>/i', function ($matches) {
            if (preg_match('/href\s*=\s*["\']((https?:)\/\/[^"\']+)["\']/i', $matches[1], $hrefMatch)) {
                $href = htmlspecialchars($hrefMatch[1], ENT_QUOTES);

                return '<a href="'.$href.'" rel="noopener noreferrer nofollow" target="_blank">';
            }

            return '<a>';
        }, $clean);

        return trim($clean);
    }
}
