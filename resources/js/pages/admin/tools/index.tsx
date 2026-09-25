import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImageListManager from '@/components/admin/ImageListManager';

interface ToolRow {
    id: number;
    name: string;
    icon_url: string | null;
    category: string | null;
    is_published: boolean;
}

export default function ToolsIndex({ tools }: { tools: ToolRow[] }) {
    return (
        <AdminLayout>
            <Head title="Software" />
            <p className="admin-eyebrow">Konten Publik</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Software Expertise</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Software yang dikuasai, tampil di bawah section Services. Tanpa ikon, inisial nama dipakai sebagai ikon.
            </p>

            <ImageListManager
                rows={tools.map((t) => ({
                    id: t.id,
                    name: t.name,
                    is_published: t.is_published,
                    imageUrl: t.icon_url,
                    extra: t.category,
                }))}
                config={{
                    baseUrl: '/admin/tools',
                    fileField: 'icon_file',
                    removeField: 'remove_icon',
                    extraField: 'category',
                    labels: {
                        item: 'software',
                        image: 'Ikon',
                        extra: 'Kategori',
                        extraPlaceholder: 'Kategori, mis. Editing / Motion',
                        namePlaceholder: 'Nama software',
                    },
                }}
            />
        </AdminLayout>
    );
}
