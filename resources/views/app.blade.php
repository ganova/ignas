<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- Scroll-reveal and staged-entrance animations only hide content once this
         runs; without it (JS disabled or failing to load) everything stays
         visible by default — see the ".js" gate in glass-reel.css. --}}
    <script>document.documentElement.classList.add('js')</script>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet" href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&display=swap">

    {{-- Inertia's <Head> component injects per-page title/meta/OG/Twitter tags server-side. --}}
    @inertiaHead

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="antialiased">
    @inertia
</body>
</html>
