import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SiteSettings } from '@/types/public';

export default function SettingsIndex({ settings }: { settings: SiteSettings }) {
    const { data, setData, put, processing, errors } = useForm(settings);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    function set<G extends keyof SiteSettings>(group: G, key: keyof SiteSettings[G], value: unknown) {
        setData((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
    }

    return (
        <AdminLayout>
            <Head title="Settings" />
            <p className="admin-eyebrow">Konfigurasi</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Site Settings</h1>

            <form onSubmit={submit} className="admin-card mt-6 max-w-3xl p-6">
                <Tabs defaultValue="identity">
                    <TabsList>
                        <TabsTrigger value="identity">Identitas</TabsTrigger>
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="showreel">Showreel</TabsTrigger>
                        <TabsTrigger value="contact">Kontak</TabsTrigger>
                        <TabsTrigger value="cta">CTA</TabsTrigger>
                        <TabsTrigger value="visual">Visual</TabsTrigger>
                    </TabsList>

                    <TabsContent value="identity" className="space-y-4">
                        <Field label="Nama portfolio">
                            <Input value={data.identity.portfolio_name} onChange={(e) => set('identity', 'portfolio_name', e.target.value)} />
                        </Field>
                        <Field label="Nama pemilik">
                            <Input value={data.identity.owner_name} onChange={(e) => set('identity', 'owner_name', e.target.value)} />
                        </Field>
                        <Field label="Profesi">
                            <Input value={data.identity.profession} onChange={(e) => set('identity', 'profession', e.target.value)} />
                        </Field>
                        <Field label="Copyright">
                            <Input value={data.identity.copyright} onChange={(e) => set('identity', 'copyright', e.target.value)} />
                        </Field>
                        <Field label="Lokasi">
                            <Input value={data.identity.location} onChange={(e) => set('identity', 'location', e.target.value)} />
                        </Field>
                        <Field label="Logo text">
                            <Input value={data.identity.logo_text} onChange={(e) => set('identity', 'logo_text', e.target.value)} />
                        </Field>
                        <Field label="About — paragraf 1">
                            <Textarea
                                value={data.identity.bio_paragraph_1}
                                onChange={(e) => set('identity', 'bio_paragraph_1', e.target.value)}
                            />
                        </Field>
                        <Field label="About — paragraf 2">
                            <Textarea
                                value={data.identity.bio_paragraph_2}
                                onChange={(e) => set('identity', 'bio_paragraph_2', e.target.value)}
                            />
                        </Field>
                    </TabsContent>

                    <TabsContent value="hero" className="space-y-4">
                        <label className="flex items-center gap-2 text-sm">
                            <Switch
                                checked={data.hero.availability_active}
                                onCheckedChange={(v) => set('hero', 'availability_active', v)}
                            />
                            Availability aktif
                        </label>
                        <Field label="Availability text">
                            <Input
                                value={data.hero.availability_text}
                                onChange={(e) => set('hero', 'availability_text', e.target.value)}
                            />
                        </Field>
                        <Field label="Heading">
                            <Input value={data.hero.heading} onChange={(e) => set('hero', 'heading', e.target.value)} />
                        </Field>
                        <Field label="Heading gradient">
                            <Input
                                value={data.hero.heading_gradient}
                                onChange={(e) => set('hero', 'heading_gradient', e.target.value)}
                            />
                        </Field>
                        <Field label="Heading suffix">
                            <Input
                                value={data.hero.heading_suffix}
                                onChange={(e) => set('hero', 'heading_suffix', e.target.value)}
                            />
                        </Field>
                        <Field label="Deskripsi">
                            <Textarea value={data.hero.description} onChange={(e) => set('hero', 'description', e.target.value)} />
                        </Field>
                        <Field label="Label tombol utama">
                            <Input
                                value={data.hero.primary_button_label}
                                onChange={(e) => set('hero', 'primary_button_label', e.target.value)}
                            />
                        </Field>
                        <Field label="Label tombol showreel">
                            <Input
                                value={data.hero.showreel_button_label}
                                onChange={(e) => set('hero', 'showreel_button_label', e.target.value)}
                            />
                        </Field>
                        <div className="grid grid-cols-3 gap-3">
                            {data.hero.stats.map((stat, i) => (
                                <div key={i} className="space-y-2 rounded-md border border-black/[0.08] p-3">
                                    <Input
                                        placeholder="Nilai"
                                        value={stat.value}
                                        onChange={(e) => {
                                            const stats = [...data.hero.stats];
                                            stats[i] = { ...stats[i]!, value: e.target.value };
                                            set('hero', 'stats', stats);
                                        }}
                                    />
                                    <Input
                                        placeholder="Label"
                                        value={stat.label}
                                        onChange={(e) => {
                                            const stats = [...data.hero.stats];
                                            stats[i] = { ...stats[i]!, label: e.target.value };
                                            set('hero', 'stats', stats);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="showreel" className="space-y-4">
                        <label className="flex items-center gap-2 text-sm">
                            <Switch
                                checked={data.showreel.is_published}
                                onCheckedChange={(v) => set('showreel', 'is_published', v)}
                            />
                            Showreel published
                        </label>
                        <p className="text-xs text-[var(--color-ink-3)]">
                            Autoplay selalu nonaktif secara paksa oleh server, sesuai ketentuan desain.
                        </p>
                        <Field label="Judul">
                            <Input value={data.showreel.title} onChange={(e) => set('showreel', 'title', e.target.value)} />
                        </Field>
                        <Field label="Durasi">
                            <Input value={data.showreel.duration} onChange={(e) => set('showreel', 'duration', e.target.value)} />
                        </Field>
                        <Field label="Video URL">
                            <Input
                                value={data.showreel.video_url ?? ''}
                                onChange={(e) => set('showreel', 'video_url', e.target.value)}
                            />
                            {errors['showreel.video_url' as keyof typeof errors] && (
                                <p className="text-xs text-red-600">{errors['showreel.video_url' as keyof typeof errors]}</p>
                            )}
                        </Field>
                        <Field label="Poster URL">
                            <Input
                                value={data.showreel.poster ?? ''}
                                onChange={(e) => set('showreel', 'poster', e.target.value)}
                            />
                        </Field>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                        <Field label="Nomor WhatsApp">
                            <Input
                                placeholder="6281234567890"
                                value={data.contact.whatsapp_number}
                                onChange={(e) => set('contact', 'whatsapp_number', e.target.value)}
                            />
                        </Field>
                        <Field label="Pesan WhatsApp default">
                            <Textarea
                                value={data.contact.whatsapp_message}
                                onChange={(e) => set('contact', 'whatsapp_message', e.target.value)}
                            />
                        </Field>
                        <Field label="Email">
                            <Input value={data.contact.email} onChange={(e) => set('contact', 'email', e.target.value)} />
                        </Field>
                        <Field label="Instagram">
                            <Input value={data.contact.instagram} onChange={(e) => set('contact', 'instagram', e.target.value)} />
                        </Field>
                        <Field label="YouTube">
                            <Input value={data.contact.youtube} onChange={(e) => set('contact', 'youtube', e.target.value)} />
                        </Field>
                        <Field label="Behance">
                            <Input value={data.contact.behance} onChange={(e) => set('contact', 'behance', e.target.value)} />
                        </Field>
                        <Field label="TikTok">
                            <Input value={data.contact.tiktok} onChange={(e) => set('contact', 'tiktok', e.target.value)} />
                        </Field>
                    </TabsContent>

                    <TabsContent value="cta" className="space-y-4">
                        <Field label="Heading">
                            <Input value={data.cta.heading} onChange={(e) => set('cta', 'heading', e.target.value)} />
                        </Field>
                        <Field label="Deskripsi">
                            <Textarea value={data.cta.description} onChange={(e) => set('cta', 'description', e.target.value)} />
                        </Field>
                        <Field label="Label tombol WhatsApp">
                            <Input
                                value={data.cta.whatsapp_button_label}
                                onChange={(e) => set('cta', 'whatsapp_button_label', e.target.value)}
                            />
                        </Field>
                        <Field label="Label tombol email">
                            <Input
                                value={data.cta.email_button_label}
                                onChange={(e) => set('cta', 'email_button_label', e.target.value)}
                            />
                        </Field>
                        <Field label="Teks sticky WhatsApp bar">
                            <Input
                                value={data.cta.sticky_bar_text}
                                onChange={(e) => set('cta', 'sticky_bar_text', e.target.value)}
                            />
                        </Field>
                    </TabsContent>

                    <TabsContent value="visual" className="space-y-4">
                        <Field label="Warna accent">
                            <Input
                                type="color"
                                value={data.visual.accent_color}
                                onChange={(e) => set('visual', 'accent_color', e.target.value)}
                            />
                        </Field>
                        <label className="flex items-center gap-2 text-sm">
                            <Switch checked={data.visual.grain_enabled} onCheckedChange={(v) => set('visual', 'grain_enabled', v)} />
                            Grain aktif
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <Switch
                                checked={data.visual.blobs_enabled}
                                onCheckedChange={(v) => set('visual', 'blobs_enabled', v)}
                            />
                            Ambient blobs aktif
                        </label>
                        <p className="text-xs text-[var(--color-ink-3)]">
                            Nonaktifkan hanya jika benar-benar diperlukan — mematikan keduanya mengubah tampilan dari
                            desain Glass Reel asli.
                        </p>
                    </TabsContent>
                </Tabs>

                <Button type="submit" className="mt-8" disabled={processing}>
                    Simpan Pengaturan
                </Button>
            </form>
        </AdminLayout>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            {children}
        </div>
    );
}
