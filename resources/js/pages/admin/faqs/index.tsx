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

interface FaqRow {
    id: number;
    question: string;
    answer: string | null;
    is_open_by_default: boolean;
    is_published: boolean;
    sort_order: number;
}

export default function FaqsIndex({ faqs }: { faqs: FaqRow[] }) {
    return (
        <AdminLayout>
            <Head title="QnA" />
            <p className="admin-eyebrow">Konten Publik</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">QnA</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Maksimum satu item yang bisa menjadi default terbuka — mengaktifkan salah satu otomatis
                menonaktifkan yang lain. Seret untuk mengubah urutan.
            </p>

            <div className="mt-6">
                <SortableList
                    items={faqs}
                    reorderUrl="/admin/faqs/reorder"
                    renderItem={(faq, handle) => <FaqForm faq={faq} handle={handle} />}
                />
            </div>

            <NewFaqForm nextOrder={faqs.length} />
        </AdminLayout>
    );
}

function FaqForm({ faq, handle }: { faq: FaqRow; handle: ReactNode }) {
    const { data, setData, put, processing } = useForm({
        question: faq.question,
        answer: faq.answer ?? '',
        is_open_by_default: faq.is_open_by_default,
        is_published: faq.is_published,
        sort_order: faq.sort_order,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                put(`/admin/faqs/${faq.id}`, { preserveScroll: true });
            }}
            className="admin-card p-4"
        >
            <div className="flex items-start gap-3">
                <div className="pt-2">{handle}</div>
                <div className="flex-1">
                    <Input
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        aria-label="Pertanyaan"
                    />
                    <Textarea
                        className="mt-3"
                        placeholder="Jawaban (paragraf & link sederhana didukung, HTML lain akan dibersihkan)"
                        value={data.answer}
                        onChange={(e) => setData('answer', e.target.value)}
                        aria-label="Jawaban"
                    />
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm">
                                <Switch checked={data.is_published} onCheckedChange={(v) => setData('is_published', v)} />
                                Published
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <Switch
                                    checked={data.is_open_by_default}
                                    onCheckedChange={(v) => setData('is_open_by_default', v)}
                                />
                                Terbuka default
                            </label>
                        </div>
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
                                title="Hapus FAQ ini?"
                                description="Tindakan ini tidak bisa dibatalkan."
                                onConfirm={() => router.delete(`/admin/faqs/${faq.id}`, { preserveScroll: true })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

function NewFaqForm({ nextOrder }: { nextOrder: number }) {
    const { data, setData, post, processing, reset } = useForm({
        question: '',
        answer: '',
        is_open_by_default: false,
        is_published: true,
        sort_order: nextOrder,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post('/admin/faqs', { preserveScroll: true, onSuccess: () => reset('question', 'answer') });
            }}
            className="admin-card mt-6 border-2 border-dashed border-white/90 bg-white/40 p-4"
        >
            <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-2)]">
                <Plus className="h-4 w-4" /> Tambah FAQ baru
            </p>
            <Input
                className="mt-3"
                placeholder="Pertanyaan"
                value={data.question}
                onChange={(e) => setData('question', e.target.value)}
            />
            <Textarea
                className="mt-3"
                placeholder="Jawaban"
                value={data.answer}
                onChange={(e) => setData('answer', e.target.value)}
            />
            <Button size="sm" type="submit" className="mt-3" disabled={processing}>
                Tambah
            </Button>
        </form>
    );
}
