<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\SiteSetting;
use Illuminate\Http\Response;

class SeoAssetsController extends Controller
{
    public function robots(): Response
    {
        $indexingEnabled = SiteSetting::indexingEnabled();

        $body = $indexingEnabled
            ? "User-agent: *\nAllow: /\nSitemap: ".url('/sitemap.xml')."\n"
            : "User-agent: *\nDisallow: /\n";

        return response($body, 200)->header('Content-Type', 'text/plain');
    }

    public function sitemap(): Response
    {
        $indexingEnabled = SiteSetting::indexingEnabled();

        $urls = [
            ['loc' => url('/'), 'lastmod' => now()->toAtomString()],
            ['loc' => route('portfolio.index'), 'lastmod' => now()->toAtomString()],
        ];

        if ($indexingEnabled) {
            Portfolio::published()->ordered()->get(['slug', 'updated_at'])->each(function ($p) use (&$urls) {
                $urls[] = ['loc' => url('/portfolio/'.$p->slug), 'lastmod' => $p->updated_at->toAtomString()];
            });
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as $u) {
            $xml .= "  <url><loc>{$u['loc']}</loc><lastmod>{$u['lastmod']}</lastmod></url>\n";
        }
        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
