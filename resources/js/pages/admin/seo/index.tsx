import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Seo {
    default_site_title: string;
    title_template: string;
    default_meta_description: string;
    default_og_image: string | null;
    indexing_enabled: boolean;
}

export default function SeoIndex({ seo, environment }: { seo: Seo; environment: string }) {
    const { data, setData, put, processing } = useForm(seo);

    return (
        <AdminLayout>
            <Head title="SEO" />
            <p className="admin-eyebrow">Konfigurasi</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">SEO</h1>

            {environment !== 'production' && (
                <p className="admin-card mt-4 border-l-4 border-l-amber-400 px-4 py-3 text-sm text-amber-700">
                    Environment saat ini: <strong>{environment}</strong>. Indexing dipaksa nonaktif di luar production
                    terlepas dari pengaturan ini.
                </p>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    put('/admin/seo');
                }}
                className="admin-card mt-6 max-w-2xl space-y-4 p-6"
            >
                <div className="space-y-1.5">
                    <Label>Default site title</Label>
                    <Input value={data.default_site_title} onChange={(e) => setData('default_site_title', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label>Title template</Label>
                    <Input value={data.title_template} onChange={(e) => setData('title_template', e.target.value)} />
                    <p className="text-xs text-[var(--color-ink-3)]">Gunakan %s sebagai placeholder judul halaman.</p>
                </div>
                <div className="space-y-1.5">
                    <Label>Default meta description</Label>
                    <Textarea
                        value={data.default_meta_description}
                        onChange={(e) => setData('default_meta_description', e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>Default OG image URL</Label>
                    <Input
                        value={data.default_og_image ?? ''}
                        onChange={(e) => setData('default_og_image', e.target.value)}
                    />
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <Switch checked={data.indexing_enabled} onCheckedChange={(v) => setData('indexing_enabled', v)} />
                    Indexing aktif (hanya berlaku di production)
                </label>

                <Button type="submit" disabled={processing}>
                    Simpan
                </Button>
            </form>
        </AdminLayout>
    );
}
