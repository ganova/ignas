import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, type PropsWithChildren } from 'react';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Sparkles,
    ListChecks,
    HelpCircle,
    Images,
    Settings,
    Search,
    LogOut,
    Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import '../../css/admin.css';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
    { href: '/admin/services', label: 'Layanan', icon: Sparkles },
    { href: '/admin/process', label: 'Proses', icon: ListChecks },
    { href: '/admin/faqs', label: 'QnA', icon: HelpCircle },
    { href: '/admin/media', label: 'Media', icon: Images },
    { href: '/admin/messages', label: 'Pesan', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/seo', label: 'SEO', icon: Search },
];

interface PageProps {
    auth: { user: { name: string; email: string } | null };
    flash: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const { props, url } = usePage<PageProps>();
    const toast = useToast();
    const lastFlash = useRef<string | null>(null);

    useEffect(() => {
        const key = JSON.stringify(props.flash);
        if (key === lastFlash.current) return;
        lastFlash.current = key;

        if (props.flash.success) toast.push(props.flash.success, 'success');
        if (props.flash.error) toast.push(props.flash.error, 'error');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.flash.success, props.flash.error]);

    const initials = (props.auth.user?.name ?? '?')
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="admin-shell flex">
            <div className="bg" aria-hidden="true">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <aside className="admin-sidebar sticky top-0 h-screen">
                <div className="flex items-center gap-2 px-5 py-5">
                    <span className="admin-logo">
                        Ignas<span className="muted">.studio</span>
                    </span>
                    <span className="admin-logo-badge">Admin</span>
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {NAV.map((item) => {
                        const active = item.href === '/admin' ? url === '/admin' : url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn('admin-nav-link', active && 'active')}
                            >
                                <Icon className="icon" strokeWidth={2} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mx-3 mb-4 mt-4 border-t border-black/[0.06] pt-4">
                    <div className="flex items-center gap-2 px-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7CFF] to-[#5AA9FF] text-xs font-bold text-white">
                            {initials}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[var(--color-ink)]">
                                {props.auth.user?.name}
                            </p>
                            <p className="truncate text-[11px] text-[var(--color-ink-3)]">
                                {props.auth.user?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => router.post('/admin/logout')}
                            className="rounded-full p-1.5 text-[var(--color-ink-3)] transition-colors hover:bg-white/70 hover:text-[var(--color-ink)]"
                            aria-label="Keluar"
                            title="Keluar"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="relative z-[1] min-h-screen flex-1">
                <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">{children}</main>
            </div>
        </div>
    );
}
