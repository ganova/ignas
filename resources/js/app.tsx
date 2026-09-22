import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ToastProvider } from '@/hooks/use-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Ignas.studio';

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    // laravel-vite-plugin's helper predates @inertiajs/react 3's stricter
    // `resolve` typing; the runtime shape is correct (verified in-browser),
    // this cast only satisfies the type checker.
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as never,
    setup({ el, App, props }) {
        const app = (
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        );
        // Hydrate when the DOM was already rendered by the SSR server, otherwise mount fresh.
        if (el.hasChildNodes()) {
            hydrateRoot(el, app);
        } else {
            createRoot(el).render(app);
        }
    },
    progress: {
        color: '#7A63FF',
    },
});
