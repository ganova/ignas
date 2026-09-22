# Ignas.studio

Full-stack portfolio + CMS for Ignas (video editor & motion designer). Public site reproduces the
"Konsep 02 — Glass Reel" design pixel-for-pixel; all of its content is editable from `/admin`.

## Stack

- **Backend:** Laravel 13 (PHP 8.3+, 8.5 recommended), PostgreSQL, Redis (cache/session/queue/rate limiting)
- **Frontend:** React 19 + TypeScript (strict), Inertia.js 2/3, Vite, Tailwind CSS 4
- **Admin UI:** shadcn-style components (Radix primitives + CVA + Tailwind) — hand-rolled locally under
  `resources/js/components/ui`, exactly how the shadcn CLI itself generates them
- **Testing:** Pest 4 (feature/unit + browser plugin)
- **Tooling:** Laravel Pint (PHP), ESLint + Prettier (TS/React)

## Running with Docker (recommended — no local PHP/Node required)

```bash
cp .env.example .env
docker compose build app
docker compose run --rm app composer install
docker compose run --rm app php artisan key:generate
docker compose run --rm app php artisan migrate --seed
docker compose run --rm app php artisan storage:link
docker compose run -v "$(pwd)":/app -w /app --rm node:22-alpine npm install
docker compose up -d
```

The `db:seed` step runs `AdminUserSeeder`, which reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.
If `ADMIN_PASSWORD` is left blank, a random password is generated and printed **once** to the
console — copy it immediately, it is never stored or shown again.

- Public site: http://localhost:8090
- Admin login: http://localhost:8090/admin/login
- Vite dev server: http://localhost:5173
- Mailpit (dev mail catcher): http://localhost:8025

### Everyday commands

| Task | Command |
|---|---|
| Start everything | `docker compose up -d` |
| Frontend dev server | included as the `vite` service, or `npm run dev` locally |
| Production build | `docker compose run --rm app npm run build && docker compose run --rm app npm run build:ssr` |
| Run queue worker | included as the `queue` service, or `php artisan queue:work` |
| Run SSR server | `php artisan inertia:start-ssr` (after `npm run build:ssr`) |
| Run tests | `docker compose run --rm app php artisan test` |
| Lint PHP | `docker compose run --rm app vendor/bin/pint` |
| Lint/format TS | `npm run lint` / `npm run format` |
| Type-check | `npm run types` |

### Creating the first admin account (without the seeder)

```bash
php artisan tinker
>>> \App\Models\User::create(['name' => 'Ignas', 'email' => 'you@example.com', 'password' => bcrypt('a-strong-password'), 'email_verified_at' => now()]);
```

There is no public registration route — this is the only supported way to create an account
besides `AdminUserSeeder`.

### Storage link

Uploaded media is stored on the `public` disk. Run `php artisan storage:link` once so
`public/storage` points at `storage/app/public` and uploaded files are web-accessible.

### Switching to MySQL/MariaDB

If PostgreSQL isn't available, set in `.env`:

```
DB_CONNECTION=mysql
DB_PORT=3306
```

No code changes are required — all queries use Eloquent.

### S3-compatible storage

Set `FILESYSTEM_DISK=s3` and fill in the `AWS_*` variables in `.env`. Because all uploads go
through Laravel's Filesystem abstraction (`App\Models\Media`, `MediaController`), no business
logic needs to change when moving from local disk to S3.

### Redis

Redis backs cache, session, and queue in this setup (`CACHE_STORE`, `SESSION_DRIVER`,
`QUEUE_CONNECTION` in `.env`). The `redis` service in `docker-compose.yml` runs it for local dev.

## What's still a placeholder

- **WhatsApp number / email / social links** — seeded as empty strings; fill them in under
  `/admin/settings` before going live.
- **Showreel video URL** — empty by default; the play button is disabled until a URL is set.
- **Forgot/reset password** — not implemented. The spec ties this to a configured production
  mailer; wire up `MAIL_*` and add the flow before relying on it. Not needed for a single-admin
  CMS created via seeder.
- **Two-factor authentication** — not implemented in this pass.
- **Pest browser tests** — included, but require Playwright browsers to be installed
  (`vendor/bin/pest --init` prompts for this, or see the Pest docs) before they can run in a given
  environment.
- **SSR** entry (`resources/js/ssr.tsx`) is wired up and buildable; running it long-term in
  production needs a process manager (systemd/supervisor) — see `docker-compose.yml`'s `queue`
  service as a template for an `ssr` service.

## Architecture notes

- All public-facing content (portfolio, services, process steps, FAQs, site settings) lives in the
  database and is only ever read through `HomeController`, which caches the whole payload and is
  invalidated by `App\Support\CacheInvalidator::publicContent()` after any admin write.
- Site-wide settings (`site_settings` table) are grouped by concern (identity, hero, showreel,
  contact, cta, visual, seo) and merged over hard-coded defaults that match the original Glass
  Reel design exactly, so an empty database still renders correctly.
- FAQ answers support a minimal safe HTML subset (`<p>`, `<br>`, `<strong>`, `<em>`, `<a>` with
  http/https hrefs only) via `App\Support\TextSanitizer`, applied server-side before storage.
- SVG uploads are rejected outright (no sanitizer is wired up); accepted types are
  JPG/PNG/WebP/AVIF only, validated by real MIME sniffing, not file extension.
