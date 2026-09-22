import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import SortableList from '@/components/admin/SortableList';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

interface ServiceRow {
    id: number;
    number: number;
    title: string;
    description: string;
    is_published: boolean;
    sort_order: number;
}

export default function ServicesIndex({ services }: { services: ServiceRow[] }) {
    return (
        <AdminLayout>
            <Head title="Layanan" />
            <p className="admin-eyebrow">Konten Publik</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Layanan</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Empat kartu layanan yang tampil di halaman publik. Seret ikon di kiri untuk mengubah urutan.
            </p>

            <div className="mt-6">
                <SortableList
                    items={services}
                    reorderUrl="/admin/services/reorder"
                    renderItem={(service, handle) => <ServiceRowForm service={service} handle={handle} />}
                />
            </div>

            <NewServiceForm nextNumber={services.length + 1} />
        </AdminLayout>
    );
}

function ServiceRowForm({ service, handle }: { service: ServiceRow; handle: ReactNode }) {
    const { data, setData, put, processing } = useForm({
        number: service.number,
        title: service.title,
        description: service.description,
        is_published: service.is_published,
        sort_order: service.sort_order,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                put(`/admin/services/${service.id}`, { preserveScroll: true });
            }}
            className="admin-card p-4"
        >
            <div className="flex items-start gap-3">
                <div className="pt-2">{handle}</div>
                <div className="flex-1">
                    <div className="grid grid-cols-[60px_1fr] gap-3">
                        <Input
                            type="number"
                            value={data.number}
                            onChange={(e) => setData('number', Number(e.target.value))}
                            aria-label="Nomor"
                        />
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} aria-label="Judul" />
                    </div>
                    <Textarea
                        className="mt-3"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        aria-label="Deskripsi"
                    />
                    <div className="mt-3 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                            <Switch checked={data.is_published} onCheckedChange={(v) => setData('is_published', v)} />
                            Published
                        </label>
                        <div className="flex gap-2">
                            <Button size="sm" type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <ConfirmDialog
                                trigger={
                                    <Button size="sm" variant="destructive" type="button">
                                        Hapus
                                    </Button>
                                }
                                title={`Hapus layanan "${service.title}"?`}
                                description="Tindakan ini tidak bisa dibatalkan."
                                onConfirm={() => router.delete(`/admin/services/${service.id}`, { preserveScroll: true })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

function NewServiceForm({ nextNumber }: { nextNumber: number }) {
    const { data, setData, post, processing, reset } = useForm({
        number: nextNumber,
        title: '',
        description: '',
        is_published: true,
        sort_order: nextNumber - 1,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post('/admin/services', { preserveScroll: true, onSuccess: () => reset('title', 'description') });
            }}
            className="admin-card mt-6 border-2 border-dashed border-white/90 bg-white/40 p-4"
        >
            <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-2)]">
                <Plus className="h-4 w-4" /> Tambah layanan baru
            </p>
            <div className="mt-3 grid grid-cols-[60px_1fr] gap-3">
                <Input type="number" value={data.number} onChange={(e) => setData('number', Number(e.target.value))} />
                <Input
                    placeholder="Judul layanan"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
            </div>
            <Textarea
                className="mt-3"
                placeholder="Deskripsi"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
            />
            <Button size="sm" type="submit" className="mt-3" disabled={processing}>
                Tambah
            </Button>
        </form>
    );
}
