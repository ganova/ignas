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
            ],
            'hero' => [
                'availability_text' => 'Slot Oktober tersisa 2',
                'availability_active' => true,
                'heading' => 'Footage kamu udah bagus,',
                'heading_gradient' => 'tinggal diedit',
                'heading_suffix' => 'biar nagih.',
                'description' => 'Video editor & motion designer. Saya bantu brand dan kreator mengubah footage mentah jadi tontonan yang tidak bisa di-skip.',
                'primary_button_label' => 'Kirim Footage',
                'showreel_button_label' => 'Lihat Showreel',
                'stats' => [
                    ['value' => '240+', 'label' => 'video selesai'],
                    ['value' => '48', 'label' => 'kreator & brand'],
                    ['value' => '2–3 hari', 'label' => 'waktu pengerjaan'],
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
                'whatsapp_message' => 'Halo Ignas, saya mau tanya soal edit video.',
                'email' => '',
                'instagram' => '',
                'youtube' => '',
                'behance' => '',
                'tiktok' => '',
            ],
            'cta' => [
                'heading' => 'Punya footage yang belum ketemu bentuknya?',
                'description' => 'Kirim linknya lewat WhatsApp, saya kasih estimasi hari ini juga.',
                'whatsapp_button_label' => 'Chat WhatsApp',
                'email_button_label' => 'Email',
                'sticky_bar_text' => 'Balasan rata-rata < 12 jam',
            ],
            'visual' => [
                'accent_color' => '#7A63FF',
                'gradient' => 'linear-gradient(110deg,#7A63FF,#4F9BFF 34%,#E884C8 66%,#F5A623)',
                'grain_enabled' => true,
                'blobs_enabled' => true,
            ],
            'seo' => [
                'default_site_title' => 'Ignas.studio — Video Editor & Motion Designer',
                'title_template' => '%s · Ignas.studio',
                'default_meta_description' => 'Ignas — video editor & motion designer. Ubah footage mentah jadi tontonan yang tidak bisa di-skip.',
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
            return '#';
        }

        return 'https://wa.me/'.$number.'?text='.rawurlencode($message);
    }
}
