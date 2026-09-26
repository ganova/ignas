import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { autoThumbnailFromVideoUrl, isVerticalPlatform } from '@/lib/video-embed';

interface Portfolio {
    id: number;
    title: string;
    slug: string;
    platform: string;
    category: string | null;
    duration: string | null;
    views_label: string | null;
    description: string | null;
    thumbnail: string | null;
    poster: string | null;
    video_url: string | null;
    video_source: 'link' | 'upload';
    video_path: string | null;
    external_url: string | null;
    gradient_from: string;
    gradient_to: string;
    is_featured: boolean;
    is_published: boolean;
    seo_title: string | null;
    seo_description: string | null;
}

interface Props {
    portfolio?: Portfolio;
    platforms: Record<string, string>;
    thumbnailUrl?: string | null;
}

export default function PortfolioForm({ portfolio, platforms, thumbnailUrl = null }: Props) {
    const isEdit = !!portfolio;

    const { data, setData, post, processing, errors } = useForm({
        title: portfolio?.title ?? '',
        slug: portfolio?.slug ?? '',
        platform: portfolio?.platform ?? Object.keys(platforms)[0],
        category: portfolio?.category ?? '',
        duration: portfolio?.duration ?? '',
        views_label: portfolio?.views_label ?? '',
        description: portfolio?.description ?? '',
        thumbnail_file: null as File | null,
        remove_thumbnail: false,
        poster: portfolio?.poster ?? '',
        video_url: portfolio?.video_url ?? '',
        video_source: portfolio?.video_source ?? 'link',
        video_file: null as File | null,
        _method: isEdit ? 'put' : undefined,
        external_url: portfolio?.external_url ?? '',
        gradient_from: portfolio?.gradient_from ?? '#B9A9FF',
        gradient_to: portfolio?.gradient_to ?? '#8FC2FF',
        is_featured: portfolio?.is_featured ?? false,
        is_published: portfolio?.is_published ?? false,
        seo_title: portfolio?.seo_title ?? '',
        seo_description: portfolio?.seo_description ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/portfolio/${portfolio!.id}`, { forceFormData: true });
        } else {
            post('/admin/portfolio', { forceFormData: true });
        }
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Project' : 'Tambah Project'} />
            <Link href="/admin/portfolio" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Portfolio
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                {isEdit ? 'Edit Project' : 'Tambah Project'}
            </h1>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
                <form onSubmit={submit} className="admin-card grid gap-5 p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Judul</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="slug">Slug (opsional)</Label>
                            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                            {errors.slug && <p className="text-xs text-red-600">{errors.slug}</p>}
                        </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-4">
                        <div>
                            <Label>Sumber video</Label>
                            <p className="mt-1 text-xs text-[var(--color-ink-3)]">Pilih link eksternal atau upload file ke hosting.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['link', 'upload'] as const).map((source) => (
                                <button
                                    key={source}
                                    type="button"
                                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${data.video_source === source ? 'border-[var(--color-purple)] bg-[var(--color-purple)]/10' : 'border-black/10'}`}
                                    onClick={() => setData('video_source', source)}
                                >
                                    {source === 'link' ? 'Gunakan link' : 'Upload ke hosting'}
                                </button>
                            ))}
                        </div>
                        {data.video_source === 'link' ? (
                            <div className="space-y-1.5">
                                <Label htmlFor="video_url">URL video</Label>
                                <Input id="video_url" placeholder="Google Drive, YouTube, Vimeo, atau MP4" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} />
                                {errors.video_url && <p className="text-xs text-red-600">{errors.video_url}</p>}
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Label htmlFor="video_file">File video</Label>
                                <Input id="video_file" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setData('video_file', e.target.files?.[0] ?? null)} />
                                <p className="text-xs text-[var(--color-ink-3)]">MP4, WebM, atau MOV. Maksimum 150MB.</p>
                                {errors.video_file && <p className="text-xs text-red-600">{errors.video_file}</p>}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="platform">Platform</Label>
                            <select
                                id="platform"
                                className="admin-select"
                                value={data.platform}
                                onChange={(e) => setData('platform', e.target.value)}
                            >
                                {Object.entries(platforms).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="category">Kategori</Label>
                            <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="duration">Durasi</Label>
                            <Input
                                id="duration"
                                placeholder="00:38"
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="views_label">Views label</Label>
                            <Input
                                id="views_label"
                                placeholder="1.2 jt"
                                value={data.views_label}
                                onChange={(e) => setData('views_label', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="external_url">Link eksternal</Label>
                            <Input
                                id="external_url"
                                value={data.external_url}
                                onChange={(e) => setData('external_url', e.target.value)}
                            />
                            {errors.external_url && <p className="text-xs text-red-600">{errors.external_url}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="seo_title">SEO title</Label>
                            <Input id="seo_title" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="seo_description">SEO description</Label>
                            <Input
                                id="seo_description"
                                value={data.seo_description}
                                onChange={(e) => setData('seo_description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 border-t border-black/[0.06] pt-5">
                        <label className="flex items-center gap-2 text-sm">
                            <Switch checked={data.is_published} onCheckedChange={(v) => setData('is_published', v)} />
                            Published
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <Switch checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v)} />
                            Featured
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/portfolio">Batal</Link>
                        </Button>
                    </div>
                </form>

                <div className="space-y-4">
                    <div className="admin-card p-4">
                        <p className="mb-3 text-xs font-bold tracking-wide text-[var(--color-ink-3)] uppercase">Thumbnail / cover</p>
                        <ThumbnailField
                            file={data.thumbnail_file}
                            uploadedUrl={portfolio?.thumbnail && !data.remove_thumbnail ? thumbnailUrl : null}
                            autoUrl={data.video_source === 'link' ? autoThumbnailFromVideoUrl(data.video_url) : null}
                            gradient={`linear-gradient(150deg,${data.gradient_from},${data.gradient_to})`}
                            vertical={isVerticalPlatform(data.platform ?? "")}
                            error={errors.thumbnail_file}
                            onPick={(f) => {
                                setData((d) => ({ ...d, thumbnail_file: f, remove_thumbnail: false }));
                            }}
                            onRemove={() => {
                                setData((d) => ({ ...d, thumbnail_file: null, remove_thumbnail: true }));
                            }}
                        />
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="gradient_from" className="text-xs">
                                    Gradient dari
                                </Label>
                                <Input
                                    id="gradient_from"
                                    type="color"
                                    value={data.gradient_from}
                                    onChange={(e) => setData('gradient_from', e.target.value)}
                                    className="h-9 p-1"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="gradient_to" className="text-xs">
                                    Gradient ke
                                </Label>
                                <Input
                                    id="gradient_to"
                                    type="color"
                                    value={data.gradient_to}
                                    onChange={(e) => setData('gradient_to', e.target.value)}
                                    className="h-9 p-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function ThumbnailField({
    file,
    uploadedUrl,
    autoUrl,
    gradient,
    vertical,
    error,
    onPick,
    onRemove,
}: {
    file: File | null;
    uploadedUrl: string | null;
    autoUrl: string | null;
    gradient: string;
    vertical: boolean;
    error?: string;
    onPick: (file: File) => void;
    onRemove: () => void;
}) {
    const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
    useEffect(() => () => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
    }, [fileUrl]);

    const src = fileUrl ?? uploadedUrl ?? autoUrl;
    const source = fileUrl || uploadedUrl ? 'upload' : autoUrl ? 'auto' : 'gradient';
    const note = {
        upload: 'Thumbnail yang di-upload.',
        auto: 'Diambil otomatis dari link video. Untuk Google Drive, file harus di-share "Anyone with the link". Kalau tidak muncul, upload gambar sendiri.',
        gradient: 'Belum ada thumbnail — kartu memakai gradient di bawah. Upload gambar, atau isi link YouTube/Google Drive untuk cover otomatis.',
    }[source];

    return (
        <div>
            <div
                className={`relative w-full overflow-hidden rounded-2xl ${vertical ? 'aspect-[9/13]' : 'aspect-video'}`}
                style={{ background: gradient }}
            >
                {src && (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                )}
                <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-2)]">
                    {source === 'upload' ? 'Upload' : source === 'auto' ? 'Otomatis' : 'Gradient'}
                </span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-3)]">{note}</p>
            <div className="mt-3 flex gap-2">
                <label className="admin-btn admin-btn-glass admin-btn-sm cursor-pointer">
                    <ImagePlus className="h-4 w-4" /> {fileUrl || uploadedUrl ? 'Ganti gambar' : 'Upload thumbnail'}
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onPick(f);
                            e.target.value = '';
                        }}
                    />
                </label>
                {(fileUrl || uploadedUrl) && (
                    <button type="button" className="admin-btn admin-btn-glass admin-btn-sm" onClick={onRemove}>
                        <Trash2 className="h-4 w-4" /> Hapus
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <p className="mt-2 text-[11px] text-[var(--color-ink-3)]">PNG, JPG, atau WebP, maks 5 MB.</p>
        </div>
    );
}
