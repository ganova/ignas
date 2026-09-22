<?php

use App\Models\SiteSetting;
use App\Support\CacheInvalidator;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Writes English copy directly into the site_settings table rather than
     * relying on SiteSetting::defaults(), because the deploy platform here
     * has been observed serving a stale compiled version of that file after
     * a deploy (Portfolio/Service seeder changes from the same commit take
     * effect, but SiteSetting::defaults() edits do not) — a stored DB row
     * always wins over the in-code default regardless of that.
     */
    public function up(): void
    {
        SiteSetting::flush();

        SiteSetting::putGroup('hero', [
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
        ]);

        SiteSetting::putGroup('contact', array_merge(SiteSetting::group('contact'), [
            'whatsapp_message' => 'Hi Ignas, I have a question about video editing.',
        ]));

        SiteSetting::putGroup('cta', [
            'heading' => "Got footage that hasn't found its shape yet?",
            'description' => "Send the link over WhatsApp and I'll get you an estimate today.",
            'whatsapp_button_label' => 'Chat on WhatsApp',
            'email_button_label' => 'Email',
            'sticky_bar_text' => 'Average reply time < 12 hours',
        ]);

        SiteSetting::putGroup('seo', array_merge(SiteSetting::group('seo'), [
            'default_meta_description' => "Ignas — video editor & motion designer. Turning raw footage into content people can't skip.",
        ]));

        CacheInvalidator::publicContent();
    }

    public function down(): void
    {
        //
    }
};
