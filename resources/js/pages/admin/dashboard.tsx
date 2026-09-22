import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Film, Layers, Sparkles, HelpCircle, PlusCircle, Wand2, MessageCircle } from 'lucide-react';

interface Props {
    stats: {
        portfolio_total: number;
        portfolio_published: number;
        services_total: number;
        faqs_total: number;
        showreel_published: boolean;
        availability_active: boolean;
        availability_text: string;
    };
    recentlyUpdated: { type: string; title: string; updated_at: string }[];
}

const STAT_CARDS = [
    { key: 'portfolio_total', label: 'Total Portfolio', icon: Layers, format: (v: unknown) => String(v) },
    { key: 'portfolio_published', label: 'Published', icon: Film, format: (v: unknown) => String(v) },
    { key: 'services_total', label: 'Layanan', icon: Sparkles, format: (v: unknown) => String(v) },
    { key: 'faqs_total', label: 'FAQ', icon: HelpCircle, format: (v: unknown) => String(v) },
] as const;

export default function Dashboard({ stats, recentlyUpdated }: Props) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="mb-8">
                <p className="admin-eyebrow">Overview</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                    Halo, <span className="admin-grad-text">Ignas</span>.
                </h1>
                <p className="mt-1 text-sm text-[var(--color-ink-2)]">Ringkasan konten portfolio kamu hari ini.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STAT_CARDS.map(({ key, label, icon: Icon, format }) => (
                    <Card key={key}>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle>{label}</CardTitle>
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B7CFF] to-[#5AA9FF] text-white">
                                <Icon className="h-4 w-4" strokeWidth={2.25} />
                            </span>
                        </CardHeader>
                        <CardContent className="text-3xl font-extrabold tracking-tight">
                            {format(stats[key])}
                        </CardContent>
                    </Card>
                ))}

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Showreel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className={`admin-badge ${stats.showreel_published ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                            {stats.showreel_published ? 'Published' : 'Draft'}
                        </span>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.availability_active ? (
                            <span className="admin-badge admin-badge-success">
                                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {stats.availability_text}
                            </span>
                        ) : (
                            <span className="admin-badge admin-badge-neutral">Nonaktif</span>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                    <Link href="/admin/portfolio/create">
                        <PlusCircle className="h-4 w-4" /> Tambah project
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/settings">
                        <Wand2 className="h-4 w-4" /> Perbarui showreel
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/settings">
                        <MessageCircle className="h-4 w-4" /> Ubah kontak
                    </Link>
                </Button>
            </div>

            <div className="admin-card mt-8 overflow-hidden">
                <div className="border-b border-black/[0.06] px-5 py-4">
                    <h2 className="text-sm font-bold text-[var(--color-ink)]">Konten terakhir diperbarui</h2>
                </div>
                <ul className="divide-y divide-black/[0.05]">
                    {recentlyUpdated.map((item, i) => (
                        <li key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                            <span>
                                <span className="admin-badge admin-badge-neutral mr-2">{item.type}</span>
                                {item.title}
                            </span>
                            <span className="text-[var(--color-ink-3)]">
                                {new Date(item.updated_at).toLocaleDateString('id-ID')}
                            </span>
                        </li>
                    ))}
                    {recentlyUpdated.length === 0 && (
                        <li className="px-5 py-6 text-center text-sm text-[var(--color-ink-3)]">Belum ada aktivitas.</li>
                    )}
                </ul>
            </div>
        </AdminLayout>
    );
}
