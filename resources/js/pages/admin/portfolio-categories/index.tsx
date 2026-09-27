import { Form, Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Category {
    id: number;
    name: string;
}

export default function PortfolioCategoriesIndex({ categories }: { categories: Category[] }) {
    const [editing, setEditing] = useState<Category | null>(null);

    return (
        <AdminLayout>
            <Head title="Kategori Portfolio" />
            <p className="admin-eyebrow">Master Data</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Kategori Portfolio</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Daftar standar untuk mengelompokkan Short-Form. Perubahan nama otomatis diterapkan ke project terkait.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
                <Form
                    action={editing ? `/admin/portfolio-categories/${editing.id}` : '/admin/portfolio-categories'}
                    method="post"
                    className="admin-card h-fit space-y-4 p-5"
                    resetOnSuccess
                    onSuccess={() => setEditing(null)}
                >
                    {editing && <input type="hidden" name="_method" value="put" />}
                    <h2 className="font-bold">{editing ? 'Edit kategori' : 'Tambah kategori'}</h2>
                    <Input
                        name="name"
                        key={editing?.id ?? 'new'}
                        defaultValue={editing?.name ?? ''}
                        placeholder="Contoh: Talking Head"
                        required
                    />
                    <div className="flex gap-2">
                        <Button type="submit">
                            <Plus className="h-4 w-4" /> {editing ? 'Simpan' : 'Tambah'}
                        </Button>
                        {editing && (
                            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                                Batal
                            </Button>
                        )}
                    </div>
                </Form>

                <div className="admin-card divide-y divide-black/[0.06] overflow-hidden">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center gap-3 px-5 py-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-xs text-[var(--color-ink-3)]">Tersedia pada form project</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(category)}>
                                <Pencil className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (window.confirm(`Hapus kategori “${category.name}”?`)) {
                                        router.delete(`/admin/portfolio-categories/${category.id}`);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" /> Hapus
                            </Button>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="p-5 text-sm text-[var(--color-ink-3)]">Belum ada kategori.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
