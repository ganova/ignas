<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    public const CACHE_KEY = 'site-settings:all';

    /**
     * Default values reproduce the original Glass Reel design exactly.
     * These are the fallback used when no admin override exists yet.
     */
    public static function defaults(): array
    {
        return [
            'identity' => [
                'portfolio_name' => 'Ignas.studio',
                'owner_name' => 'Ignas',
                'profession' => 'Video Editor & Motion Designer',
                'copyright' => '© 2026 Ignas · Video Editor & Motion Designer',
                'location' => 'Indonesia',
                'logo_text' => 'Ignas.studio',
                'bio_paragraph_1' => "Six years living inside the timeline. I believe good editing shouldn't be noticed — viewers just realize they can't stop watching.",
                'bio_paragraph_2' => "My focus isn't just cutting and arranging clips — it's designing the pacing, rhythm, and retention moments that keep an audience watching until the end, then acting.",
            ],
            'hero' => [
                'availability_text' => '2 slots left this month',
                'availability_active' => true,
                'heading' => 'Your footage is already good,',
                'heading_gradient' => 'it just needs an edit',
                'heading_suffix' => 'that hooks people.',
                'description' => "Video editor & motion designer. I help brands and creators turn raw footage into content people can't skip.",
                'primary_button_label' => 'Send Your Footage',
                'showreel_button_label' => 'Watch Showreel',
                'stats' => [
                    ['value' => '240+', 'label' => 'videos delivered'],
                    ['value' => '48', 'label' => 'creators & brands'],
                    ['value' => '2–3 days', 'label' => 'turnaround time'],
                ],
            ],
            'showreel' => [
                'title' => 'SHOWREEL 2026',
                'duration' => '01:48',
                'video_url' => '',
                'video_file' => null,
                'poster' => null,
                'is_published' => true,
                'autoplay' => false,
            ],
            'contact' => [
                'whatsapp_number' => '',
                'whatsapp_message' => 'Hi Ignas, I have a question about video editing.',
                'email' => '',
                'instagram' => '',
                'youtube' => '',
                'behance' => '',
                'tiktok' => '',
            ],
            'cta' => [
                'heading' => "Got footage that hasn't found its shape yet?",
                'description' => "Send the link over WhatsApp and I'll get you an estimate today.",
                'whatsapp_button_label' => 'Chat on WhatsApp',
                'email_button_label' => 'Email',
                'sticky_bar_text' => 'Average reply time < 12 hours',
            ],
            'visual' => [
                'accent_color' => '#7A63FF',
                'gradient' => 'linear-gradient(110deg,#7A63FF,#4F9BFF 34%,#E884C8 66%,#F5A623)',
                'grain_enabled' => true,
                'blobs_enabled' => true,
            ],
            'portfolio' => [
                'short_form_limit' => 12,
                'long_form_limit' => 6,
            ],
            'seo' => [
                'default_site_title' => 'Ignas.studio — Video Editor & Motion Designer',
                'title_template' => '%s · Ignas.studio',
                'default_meta_description' => "Ignas — video editor & motion designer. Turning raw footage into content people can't skip.",
                'default_og_image' => null,
                'indexing_enabled' => false,
            ],
        ];
    }

    /**
     * All setting groups merged over the design defaults. Named allGroups()
     * rather than all() because Eloquent\Model::all() is a static method
     * with an incompatible signature — overriding it fatals at class-load.
     */
    public static function allGroups(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $stored = static::query()->pluck('value', 'key')->toArray();

            return array_replace_recursive(self::defaults(), $stored);
        });
    }

    public static function group(string $group): array
    {
        return self::allGroups()[$group] ?? [];
    }

    public static function putGroup(string $group, array $value): void
    {
        static::updateOrCreate(['key' => $group], ['value' => $value]);
        self::flush();
    }

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Indexing is only ever allowed in production, regardless of the stored
     * admin preference, per the requirement that dev/staging stay noindex.
     */
    public static function indexingEnabled(): bool
    {
        return app()->environment('production') && (bool) (self::group('seo')['indexing_enabled'] ?? false);
    }

    public static function whatsappUrl(): string
    {
        $contact = self::group('contact');
        $number = preg_replace('/\D+/', '', (string) ($contact['whatsapp_number'] ?? ''));
        $message = (string) ($contact['whatsapp_message'] ?? '');

        if ($number === '') {
            return '';
        }

        return 'https://wa.me/'.$number.'?text='.rawurlencode($message);
    }
}
