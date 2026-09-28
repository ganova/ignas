import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImageListManager from '@/components/admin/ImageListManager';

interface PhotoRow {
    id: number;
    title: string;
    image_url: string;
    caption: string | null;
    is_published: boolean;
}

export default function PhotosIndex({ photos }: { photos: PhotoRow[] }) {
    return (
        <AdminLayout>
            <Head title="Galeri Foto" />
            <p className="admin-eyebrow">Konten Publik</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Galeri Foto</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Portfolio foto kecil yang tampil di homepage. Seret item untuk mengatur urutannya.
            </p>

            <ImageListManager
                rows={photos.map((photo) => ({
                    id: photo.id,
                    name: photo.title,
                    is_published: photo.is_published,
                    imageUrl: photo.image_url,
                    extra: photo.caption,
                }))}
                config={{
                    baseUrl: '/admin/photos',
                    nameField: 'title',
                    fileField: 'photo_file',
                    removeField: 'remove_photo',
                    extraField: 'caption',
                    allowRemove: false,
                    labels: {
                        item: 'foto',
                        image: 'Foto portfolio',
                        extra: 'Caption',
                        extraPlaceholder: 'Caption singkat (opsional)',
                        namePlaceholder: 'Judul foto',
                    },
                }}
            />
        </AdminLayout>
    );
}
