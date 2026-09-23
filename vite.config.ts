import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(dirname, 'resources/js'),
        },
    },
    server: {
        // Docker binds Vite to 0.0.0.0; without an explicit origin the Laravel
        // plugin writes that unroutable address into public/hot.
        origin: 'http://localhost:5173',
        cors: { origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ },
        watch: {
            ignored: ['**/storage/framework/views/**'],
            // The vite service runs in Docker against this repo bind-mounted
            // from Windows; native fs events (inotify) from host-side edits
            // don't reliably propagate through Docker Desktop's file sharing,
            // so Vite silently keeps serving the pre-edit transform of a
            // changed file until the container restarts. Polling instead of
            // waiting for those events is slightly more CPU, but is the only
            // way HMR sees edits made from the host in this setup.
            usePolling: true,
            interval: 300,
        },
    },
});
