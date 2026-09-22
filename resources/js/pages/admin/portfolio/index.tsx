import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Star, Search } from 'lucide-react';

interface PortfolioRow {
    id: number;
    title: string;
    platform: string;
    thumbnail: string | null;
    gradient_from: string;
    gradient_to: string;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
}

interface Props {
    portfolios: { data: PortfolioRow[]; links: { url: string | null; label: string; active: boolean }[] };
    platforms: Record<string, string>;
    filters: { search?: string; platform?: string; status?: string };
}

export default function PortfolioIndex({ portfolios, platforms, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        platform: filters.platform ?? '',
        status: filters.status ?? '',
    });
    const [selected, setSelected] = useState<number[]>([]);
    const toast = useToast();

    function applyFilters(e?: React.FormEvent) {
        e?.preventDefault();
        get('/admin/portfolio', { preserveState: true });
    }

    function togglePublish(row: PortfolioRow) {
        router.patch(`/admin/portfolio/${row.id}/toggle-publish`, {}, { preserveScroll: true, preserveState: true });
    }

    function toggleFeatured(row: PortfolioRow) {
        router.patch(`/admin/portfolio/${row.id}/toggle-featured`, {}, { preserveScroll: true, preserveState: true });
    }

    function toggleSelect(id: number) {
        setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    function toggleSelectAll() {
        setSelected((prev) => (prev.length === portfolios.data.length ? [] : portfolios.data.map((p) => p.id)));
    }

    function bulkPublish(publish: boolean) {
        Promise.all(
            selected.map(
                (id) =>
                    new Promise((resolve) =>
                        router.patch(
                            `/admin/portfolio/${id}/toggle-publish`,
                            {},
                            { preserveScroll: true, preserveState: true, onFinish: () => resolve(null) },
                        ),
                    ),
            ),
        ).then(() => {
            toast.push(`${selected.length} project ${publish ? 'dipublikasikan' : 'di-draft'}.`);
            setSelected([]);
        });
    }

    function bulkDelete() {
        Promise.all(
            selected.map(
                (id) =>
                    new Promise((resolve) =>
                        router.delete(`/admin/portfolio/${id}`, {
                            preserveScroll: true,
                            preserveState: true,
                            onFinish: () => resolve(null),
                        }),
                    ),
            ),
        ).then(() => {
            toast.push(`${selected.length} project dipindahkan ke trash.`);
            setSelected([]);
        });
    }

    return (
        <AdminLayout>
            <Head title="Portfolio" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="admin-eyebrow">Konten Publik</p>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Portfolio</h1>
                </div>
                <Button asChild>
                    <Link href="/admin/portfolio/create">
                        <Plus className="h-4 w-4" /> Tambah project
                    </Link>
                </Button>
            </div>

            <form onSubmit={applyFilters} className="mt-6 flex flex-wrap gap-2">
                <div className="relative max-w-xs flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-3)]" />
                    <Input
                        placeholder="Cari judul..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="pl-8"
                    />
                </div>
                <select
                    className="admin-select h-9 w-auto"
                    value={data.platform}
                    onChange={(e) => setData('platform', e.target.value)}
                >
                    <option value="">Semua platform</option>
                    {Object.entries(platforms).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <select
                    className="admin-select h-9 w-auto"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                >
                    <option value="">Semua status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <Button type="submit" variant="outline">
                    Filter
                </Button>
            </form>

            {selected.length > 0 && (
                <div className="admin-card mt-4 flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold">{selected.length} dipilih</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => bulkPublish(true)}>
                            Publish
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => bulkPublish(false)}>
                            Draft
                        </Button>
                        <ConfirmDialog
                            trigger={
                                <Button size="sm" variant="destructive">
                                    Hapus terpilih
                                </Button>
                            }
                            title={`Hapus ${selected.length} project?`}
                            description="Project akan dipindahkan ke trash dan bisa dipulihkan nanti."
                            onConfirm={bulkDelete}
                        />
                    </div>
                </div>
            )}

            <div className="admin-card mt-4 overflow-hidden">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="w-10">
                                <input
                                    type="checkbox"
                                    checked={selected.length === portfolios.data.length && portfolios.data.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Project</th>
                            <th>Platform</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolios.data.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(row.id)}
                                        onChange={() => toggleSelect(row.id)}
                                    />
                                </td>
                                <td className="font-semibold">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-9 w-9 shrink-0 rounded-lg bg-cover bg-center"
                                            style={{
                                                background: row.thumbnail
                                                    ? `url(${row.thumbnail}) center/cover`
                                                    : `linear-gradient(150deg,${row.gradient_from},${row.gradient_to})`,
                                            }}
                                        />
                                        {row.title}
                                    </div>
                                </td>
                                <td className="text-[var(--color-ink-2)]">{platforms[row.platform] ?? row.platform}</td>
                                <td>
                                    <button
                                        onClick={() => togglePublish(row)}
                                        className={`admin-badge ${row.is_published ? 'admin-badge-success' : 'admin-badge-neutral'}`}
                                    >
                                        {row.is_published ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleFeatured(row)}
                                        aria-pressed={row.is_featured}
                                        aria-label="Toggle featured"
                                        className={row.is_featured ? 'text-[var(--color-yellow)]' : 'text-[var(--color-ink-3)]'}
                                    >
                                        <Star className="h-4 w-4" fill={row.is_featured ? 'currentColor' : 'none'} />
                                    </button>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/admin/portfolio/${row.id}/edit`}>Edit</Link>
                                        </Button>
                                        <ConfirmDialog
                                            trigger={
                                                <Button size="sm" variant="destructive">
                                                    Hapus
                                                </Button>
                                            }
                                            title={`Hapus "${row.title}"?`}
                                            description="Project akan dipindahkan ke trash dan bisa dipulihkan nanti."
                                            onConfirm={() => router.delete(`/admin/portfolio/${row.id}`)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {portfolios.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-ink-3)]">
                                    Tidak ada project.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-1">
                {portfolios.links.map((link, i) => (
                    <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                        className="admin-btn admin-btn-glass admin-btn-sm disabled:opacity-40"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
