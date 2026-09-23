import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';

interface MessageRow {
    id: number;
    name: string;
    email: string;
    whatsapp: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function MessagesIndex({ messages }: { messages: MessageRow[] }) {
    return (
        <AdminLayout>
            <Head title="Pesan" />
            <p className="admin-eyebrow">Kontak</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Pesan Masuk</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                Pesan dari form kontak di halaman publik. Notifikasi juga dikirim ke email kalau sudah diatur di
                Settings &rarr; Kontak.
            </p>

            <div className="mt-6 space-y-3">
                {messages.length === 0 && (
                    <div className="admin-card p-6 text-center text-sm text-[var(--color-ink-3)]">
                        Belum ada pesan masuk.
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`admin-card p-4 ${!m.is_read ? 'border-2 border-[var(--color-purple)]' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-bold">{m.name}</p>
                                    {!m.is_read && <span className="admin-badge">Baru</span>}
                                </div>
                                <p className="text-xs text-[var(--color-ink-3)]">
                                    {m.email}
                                    {m.whatsapp ? ` · ${m.whatsapp}` : ''} · {new Date(m.created_at).toLocaleString('id-ID')}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink-2)]">{m.message}</p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.patch(`/admin/messages/${m.id}/read`, {}, { preserveScroll: true })}
                                >
                                    {m.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}
                                </Button>
                                <ConfirmDialog
                                    trigger={
                                        <Button size="sm" variant="destructive" type="button">
                                            Hapus
                                        </Button>
                                    }
                                    title="Hapus pesan ini?"
                                    description="Tindakan ini tidak bisa dibatalkan."
                                    onConfirm={() => router.delete(`/admin/messages/${m.id}`, { preserveScroll: true })}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
