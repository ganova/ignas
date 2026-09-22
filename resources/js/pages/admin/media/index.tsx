import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { UploadCloud, Trash2 } from 'lucide-react';

interface MediaItem {
    id: number;
    path: string;
    original_name: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    url: string;
}

interface Props {
    media: { data: MediaItem[] };
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function MediaIndex({ media }: Props) {
    const { data, setData, processing, reset } = useForm<{ file: File | null; alt_text: string }>({
        file: null,
        alt_text: '',
    });
    const [isDragging, setIsDragging] = useState(false);

    function upload(file?: File | null) {
        const f = file ?? data.file;
        if (!f) return;
        router.post(
            '/admin/media',
            { file: f, alt_text: data.alt_text },
            { forceFormData: true, preserveScroll: true, onSuccess: () => reset() },
        );
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && ACCEPTED.includes(file.type)) {
            setData('file', file);
            upload(file);
        }
    }

    return (
        <AdminLayout>
            <Head title="Media" />
            <p className="admin-eyebrow">Aset</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Media Library</h1>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`admin-card mt-6 flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${
                    isDragging ? 'border-[var(--color-purple)] bg-[var(--color-purple)]/5' : 'border-white/90'
                }`}
            >
                <UploadCloud className="h-8 w-8 text-[var(--color-purple-dark)]" strokeWidth={1.75} />
                <p className="text-sm font-semibold">Seret & lepas gambar di sini</p>
                <p className="text-xs text-[var(--color-ink-3)]">JPG, PNG, WebP, atau AVIF — maksimum 10MB</p>

                <div className="mt-2 flex items-center gap-2">
                    <label className="admin-btn admin-btn-glass admin-btn-sm cursor-pointer">
                        Pilih file
                        <input
                            type="file"
                            className="hidden"
                            accept={ACCEPTED.join(',')}
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setData('file', file);
                                if (file) upload(file);
                            }}
                        />
                    </label>
                    <Input
                        placeholder="Alt text (opsional)"
                        value={data.alt_text}
                        onChange={(e) => setData('alt_text', e.target.value)}
                        className="max-w-[200px]"
                    />
                </div>
                {processing && <p className="text-xs text-[var(--color-ink-3)]">Mengunggah...</p>}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {media.data.map((item) => (
                    <div key={item.id} className="admin-card group relative overflow-hidden p-2">
                        <img
                            src={item.url}
                            alt={item.alt_text ?? ''}
                            width={item.width ?? undefined}
                            height={item.height ?? undefined}
                            loading="lazy"
                            className="aspect-square w-full rounded-xl object-cover"
                        />
                        <p className="mt-2 truncate text-xs font-medium text-[var(--color-ink)]">{item.original_name}</p>
                        <p className="text-[11px] text-[var(--color-ink-3)]">{(item.size / 1024).toFixed(0)} KB</p>
                        <ConfirmDialog
                            trigger={
                                <button
                                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                                    aria-label="Hapus"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            }
                            title="Hapus media ini?"
                            description="Media yang masih dipakai konten lain tidak akan dihapus."
                            onConfirm={() => router.delete(`/admin/media/${item.id}`, { preserveScroll: true })}
                        />
                    </div>
                ))}
                {media.data.length === 0 && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-ink-3)]">Belum ada media.</p>
                )}
            </div>
        </AdminLayout>
    );
}
