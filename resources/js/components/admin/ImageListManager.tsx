import { router, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ImagePlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import SortableList from '@/components/admin/SortableList';

export interface ImageListRow {
    id: number;
    name: string;
    is_published: boolean;
    imageUrl: string | null;
    extra: string | null;
}

interface Config {
    /** e.g. "/admin/brands" */
    baseUrl: string;
    /** Form field names used by the backend. */
    fileField: string;
    removeField: string;
    extraField: string;
    labels: { item: string; image: string; extra: string; extraPlaceholder: string; namePlaceholder: string };
    extraType?: 'url' | 'text';
}

type FormValues = Record<string, string | boolean | File | null>;

const ACCEPT = 'image/png,image/jpeg,image/webp';

function ImagePicker({
    currentUrl,
    file,
    label,
    onPick,
    onRemove,
}: {
    currentUrl: string | null;
    file: File | null;
    label: string;
    onPick: (f: File | null) => void;
    onRemove?: () => void;
}) {
    const preview = file ? URL.createObjectURL(file) : currentUrl;

    return (
        <div className="flex items-center gap-2">
            <label
                className="flex h-14 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-black/15 bg-white/60 hover:border-[var(--color-purple)]"
                title={label}
            >
                {preview ? (
                    <img src={preview} alt="" className="max-h-12 max-w-[88px] object-contain" />
                ) : (
                    <ImagePlus className="h-5 w-5 text-[var(--color-ink-3)]" />
                )}
                <input
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    aria-label={label}
                    onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                />
            </label>
            {onRemove && (currentUrl || file) && (
                <button type="button" className="text-xs text-[var(--color-ink-3)] underline" onClick={onRemove}>
                    Hapus
                </button>
            )}
        </div>
    );
}

function RowForm({ row, handle, config }: { row: ImageListRow; handle: ReactNode; config: Config }) {
    const { data, setData, post, processing, errors } = useForm<FormValues>({
        name: row.name,
        [config.extraField]: row.extra ?? '',
        is_published: row.is_published,
        [config.fileField]: null,
        [config.removeField]: false,
    });
    const file = data[config.fileField] as File | null;
    const removed = Boolean(data[config.removeField]);

    return (
        <form
            className="admin-card flex flex-wrap items-center gap-3 p-4"
            onSubmit={(e) => {
                e.preventDefault();
                post(`${config.baseUrl}/${row.id}`, { preserveScroll: true, forceFormData: true });
            }}
        >
            {handle}
            <ImagePicker
                currentUrl={removed ? null : row.imageUrl}
                file={file}
                label={config.labels.image}
                onPick={(f) => {
                    setData(config.fileField, f);
                    setData(config.removeField, false);
                }}
                onRemove={() => {
                    setData(config.fileField, null);
                    setData(config.removeField, true);
                }}
            />
            <div className="min-w-[160px] flex-1">
                <Input
                    value={data.name as string}
                    onChange={(e) => setData('name', e.target.value)}
                    aria-label="Nama"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="min-w-[160px] flex-1">
                <Input
                    type={config.extraType ?? 'text'}
                    placeholder={config.labels.extraPlaceholder}
                    value={data[config.extraField] as string}
                    onChange={(e) => setData(config.extraField, e.target.value)}
                    aria-label={config.labels.extra}
                />
                {errors[config.extraField] && <p className="mt-1 text-xs text-red-600">{errors[config.extraField]}</p>}
                {errors[config.fileField] && <p className="mt-1 text-xs text-red-600">{errors[config.fileField]}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm">
                <Switch
                    checked={data.is_published as boolean}
                    onCheckedChange={(v) => setData('is_published', v)}
                />
                Tampil
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
                    title={`Hapus ${config.labels.item} "${row.name}"?`}
                    description="Tindakan ini tidak bisa dibatalkan."
                    onConfirm={() => router.delete(`${config.baseUrl}/${row.id}`, { preserveScroll: true })}
                />
            </div>
        </form>
    );
}

function NewRowForm({ config }: { config: Config }) {
    const { data, setData, post, processing, errors, reset } = useForm<FormValues>({
        name: '',
        [config.extraField]: '',
        is_published: true,
        [config.fileField]: null,
    });

    return (
        <form
            className="admin-card mt-6 flex flex-wrap items-center gap-3 border-2 border-dashed border-white/90 bg-white/40 p-4"
            onSubmit={(e) => {
                e.preventDefault();
                post(config.baseUrl, { preserveScroll: true, forceFormData: true, onSuccess: () => reset() });
            }}
        >
            <p className="flex w-full items-center gap-1.5 text-sm font-bold text-[var(--color-ink-2)]">
                <Plus className="h-4 w-4" /> Tambah {config.labels.item}
            </p>
            <ImagePicker
                currentUrl={null}
                file={data[config.fileField] as File | null}
                label={config.labels.image}
                onPick={(f) => setData(config.fileField, f)}
            />
            <div className="min-w-[160px] flex-1">
                <Input
                    placeholder={config.labels.namePlaceholder}
                    value={data.name as string}
                    onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="min-w-[160px] flex-1">
                <Input
                    type={config.extraType ?? 'text'}
                    placeholder={config.labels.extraPlaceholder}
                    value={data[config.extraField] as string}
                    onChange={(e) => setData(config.extraField, e.target.value)}
                />
                {errors[config.extraField] && <p className="mt-1 text-xs text-red-600">{errors[config.extraField]}</p>}
                {errors[config.fileField] && <p className="mt-1 text-xs text-red-600">{errors[config.fileField]}</p>}
            </div>
            <Button size="sm" type="submit" disabled={processing}>
                Tambah
            </Button>
        </form>
    );
}

export default function ImageListManager({ rows, config }: { rows: ImageListRow[]; config: Config }) {
    return (
        <>
            <div className="mt-6">
                <SortableList
                    items={rows}
                    reorderUrl={`${config.baseUrl}/reorder`}
                    renderItem={(row, handle) => <RowForm key={row.id} row={row} handle={handle} config={config} />}
                />
            </div>
            <NewRowForm config={config} />
            <p className="mt-3 text-xs text-[var(--color-ink-3)]">
                Gambar PNG, JPG, atau WebP. Tanpa gambar, nama akan tampil sebagai teks. Seret untuk mengubah urutan.
            </p>
        </>
    );
}
