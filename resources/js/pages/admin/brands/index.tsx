import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImageListManager from '@/components/admin/ImageListManager';

interface BrandRow {
    id: number;
    name: string;
    logo_url: string | null;
    website_url: string | null;
    is_published: boolean;
}

export default function BrandsIndex({ brands }: { brands: BrandRow[] }) {
    return (
        <AdminLayout>
            <Head title="Brand Klien" />
            <p className="admin-eyebrow">Konten Publik</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Brand Klien</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Logo brand & kreator yang pernah dikerjakan, tampil sebagai marquee bergerak di bawah Portfolio.
            </p>

            <ImageListManager
                rows={brands.map((b) => ({
                    id: b.id,
                    name: b.name,
                    is_published: b.is_published,
                    imageUrl: b.logo_url,
                    extra: b.website_url,
                }))}
                config={{
                    baseUrl: '/admin/brands',
                    fileField: 'logo_file',
                    removeField: 'remove_logo',
                    extraField: 'website_url',
                    extraType: 'url',
                    labels: {
                        item: 'brand',
                        image: 'Logo',
                        extra: 'Website',
                        extraPlaceholder: 'https://website-brand.com (opsional)',
                        namePlaceholder: 'Nama brand',
                    },
                }}
            />
        </AdminLayout>
    );
}
