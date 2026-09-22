import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import '../../../../css/admin.css';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/login');
    }

    return (
        <div className="admin-shell flex min-h-screen items-center justify-center">
            <Head title="Login Admin" />
            <div className="bg" aria-hidden="true">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <form onSubmit={submit} className="admin-card relative z-[1] w-full max-w-sm p-8">
                <span className="admin-logo-badge">Admin</span>
                <h1 className="mt-3 text-lg font-extrabold tracking-tight">
                    Ignas<span className="text-[var(--color-ink-3)] font-medium">.studio</span>
                </h1>
                <p className="mt-1 text-sm text-[var(--color-ink-2)]">Masuk untuk mengelola konten.</p>

                <div className="mt-6 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                    </div>
                </div>

                <Button type="submit" className="mt-6 w-full justify-center" disabled={processing}>
                    Masuk
                </Button>
            </form>
        </div>
    );
}
