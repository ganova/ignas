import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../css/glass-reel.css';
import type { PortfolioItem, PortfolioPageProps } from '@/types/public';
import AmbientBackground from '@/components/public/AmbientBackground';
import SiteNav from '@/components/public/SiteNav';
import CtaSection from '@/components/public/CtaSection';
import StickyWhatsapp from '@/components/public/StickyWhatsapp';
import SiteFooter from '@/components/public/SiteFooter';
import ScrollProgress from '@/components/public/ScrollProgress';
import PortfolioCard, {
    FormatBadge,
    PortfolioMedia,
    portfolioFormat,
    type PortfolioFormat,
} from '@/components/public/PortfolioCard';
import VideoLightbox from '@/components/public/VideoLightbox';
import { isVerticalPlatform, resolveVideoEmbed } from '@/lib/video-embed';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type ViewMode = 'grid' | 'index';

const VIEW_STORAGE_KEY = 'portfolio-view';
const SPOTLIGHT_LIMIT = 2;

const FORMAT_LABELS: Record<PortfolioFormat, string> = { short: 'Short-Form', long: 'Long-Form' };

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

function SpotlightCard({ item, number }: { item: PortfolioItem; number: number }) {
    const [origin, setOrigin] = useState<DOMRect | null>(null);
    const embed = resolveVideoEmbed(item.video_url);
    const hasLink = Boolean(item.external_url) || Boolean(embed);
    const ctaLabel = embed ? 'Play video' : hasLink ? 'Watch the project ↗' : 'Case study coming soon';
    const body = (
        <>
            <div className="spotlight-media">
                <PortfolioMedia item={item} />
                <span className="thumb-scrim" aria-hidden="true" />
                <span className="spotlight-play" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0D0D14">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </span>
            </div>
            <div className="spotlight-body">
                <div className="spotlight-top">
                    <span className="spotlight-no">No. {pad(number)}</span>
                    <span className="badge-featured spotlight-badge">Featured</span>
                </div>
                <h3>{item.title}</h3>
                {item.description && <p className="spotlight-desc">{item.description}</p>}
                <dl className="spotlight-facts">
                    <div>
                        <dt>Format</dt>
                        <dd><FormatBadge platform={item.platform} className="format-inline" /></dd>
                    </div>
                    {item.category && (
                        <div>
                            <dt>Category</dt>
                            <dd>{item.category}</dd>
                        </div>
                    )}
                    {item.duration && (
                        <div>
                            <dt>Runtime</dt>
                            <dd>{item.duration}</dd>
                        </div>
                    )}
                    {item.views_label && (
                        <div>
                            <dt>Views</dt>
                            <dd>{item.views_label}</dd>
                        </div>
                    )}
                </dl>
                <span className="spotlight-cta">{ctaLabel}</span>
            </div>
        </>
    );

    if (embed) {
        return (
            <>
                <button
                    type="button"
                    className="spotlight-card"
                    data-launching={origin ? '' : undefined}
                    data-reveal
                    aria-label={`Play video: ${item.title}`}
                    onClick={(e) => {
                        const media = e.currentTarget.querySelector('.spotlight-media') ?? e.currentTarget;
                        setOrigin(media.getBoundingClientRect());
                    }}
                >
                    {body}
                </button>
                {origin && (
                    <VideoLightbox
                        embed={embed}
                        title={item.title}
                        vertical={isVerticalPlatform(item.platform)}
                        origin={origin}
                        posterImage={item.thumbnail}
                        posterGradient={`linear-gradient(150deg,${item.gradient_from},${item.gradient_to})`}
                        onClose={() => setOrigin(null)}
                    />
                )}
            </>
        );
    }

    return hasLink ? (
        <a
            className="spotlight-card"
            data-reveal
            href={item.external_url as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${item.title} (opens in new tab)`}
        >
            {body}
        </a>
    ) : (
        <article className="spotlight-card is-static" data-reveal>
            {body}
        </article>
    );
}

function IndexList({ items, numberOf }: { items: PortfolioItem[]; numberOf: (item: PortfolioItem) => number }) {
    const [hovered, setHovered] = useState<PortfolioItem | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const canHover = useRef(false);

    useEffect(() => {
        canHover.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }, []);

    // Position is written straight to the DOM instead of React state so the
    // preview can follow the cursor every frame without re-rendering the list.
    function onMouseMove(e: React.MouseEvent) {
        const el = previewRef.current;
        if (!el || !canHover.current) return;
        el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 110}px, 0)`;
    }

    return (
        <div className="archive-index-wrap" onMouseMove={onMouseMove} onMouseLeave={() => setHovered(null)}>
            <div className="archive-index-head" aria-hidden="true">
                <span>No.</span>
                <span>Project</span>
                <span>Format</span>
                <span>Runtime</span>
                <span>Views</span>
            </div>
            <ol className="archive-index">
                {items.map((item) => {
                    const cells = (
                        <>
                            <span className="ix-no">{pad(numberOf(item))}</span>
                            <span className="ix-title">
                                <b>{item.title}</b>
                                {item.category && <small>{item.category}</small>}
                            </span>
                            <FormatBadge platform={item.platform} className="ix-platform format-inline" />
                            <span className="ix-runtime">{item.duration ?? '—'}</span>
                            <span className="ix-views">{item.views_label ?? '—'}</span>
                            <span className="ix-arrow" aria-hidden="true">
                                {item.external_url ? '↗' : ''}
                            </span>
                        </>
                    );
                    return (
                        <li
                            key={item.id}
                            data-reveal
                            onMouseEnter={() => setHovered(item)}
                            className={hovered?.id === item.id ? 'is-hovered' : undefined}
                        >
                            {item.external_url ? (
                                <a
                                    className="ix-row"
                                    href={item.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onFocus={() => setHovered(item)}
                                >
                                    {cells}
                                </a>
                            ) : (
                                <div className="ix-row is-static">{cells}</div>
                            )}
                        </li>
                    );
                })}
            </ol>

            <div className={`ix-preview ${hovered ? 'is-visible' : ''}`} ref={previewRef} aria-hidden="true">
                {hovered && (
                    <div className="ix-preview-inner" key={hovered.id}>
                        <PortfolioMedia item={hovered} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PortfolioIndex({ settings, whatsappUrl, portfolios }: PortfolioPageProps) {
    const { identity, contact, cta, visual, seo } = settings;

    useScrollReveal();

    const formats = useMemo(() => {
        const counts = new Map<PortfolioFormat, number>();
        portfolios.forEach((p) => {
            const f = portfolioFormat(p.platform);
            counts.set(f, (counts.get(f) ?? 0) + 1);
        });
        return (['short', 'long'] as const)
            .filter((f) => counts.has(f))
            .map((format) => ({ format, count: counts.get(format) ?? 0 }));
    }, [portfolios]);

    const categoryCount = useMemo(
        () => new Set(portfolios.map((p) => p.category?.trim().toLowerCase()).filter(Boolean)).size,
        [portfolios],
    );

    const numbers = useMemo(() => new Map(portfolios.map((p, i) => [p.id, i + 1])), [portfolios]);
    const numberOf = (item: PortfolioItem) => numbers.get(item.id) ?? 0;

    const [filter, setFilter] = useState<string>('all');
    const [view, setView] = useState<ViewMode>('grid');

    // Restored after mount (not in the initial state) so SSR and the first
    // client render agree.
    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get('format');
        if (fromUrl && portfolios.some((p) => portfolioFormat(p.platform) === fromUrl)) {
            setFilter(fromUrl);
        }
        try {
            const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
            if (saved === 'grid' || saved === 'index') setView(saved);
        } catch {
            /* storage unavailable — keep default */
        }
    }, [portfolios]);

    function changeFilter(next: string) {
        setFilter(next);
        const url = new URL(window.location.href);
        if (next === 'all') {
            url.searchParams.delete('format');
        } else {
            url.searchParams.set('format', next);
        }
        window.history.replaceState(window.history.state, '', url);
    }

    function changeView(next: ViewMode) {
        setView(next);
        try {
            window.localStorage.setItem(VIEW_STORAGE_KEY, next);
        } catch {
            /* ignore */
        }
    }

    const filtered = filter === 'all' ? portfolios : portfolios.filter((p) => portfolioFormat(p.platform) === filter);
    const spotlight =
        filter === 'all' && view === 'grid' ? portfolios.filter((p) => p.is_featured).slice(0, SPOTLIGHT_LIMIT) : [];
    const spotlightIds = new Set(spotlight.map((p) => p.id));
    const gridItems = filtered.filter((p) => !spotlightIds.has(p.id));

    const title = `Portfolio — ${identity.portfolio_name}`;
    const description = `The complete archive of ${portfolios.length} video editing projects by ${identity.owner_name}: ${formats
        .map((f) => FORMAT_LABELS[f.format].toLowerCase())
        .join(' and ')} video.`;
    const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + '/portfolio' : '/portfolio';

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: portfolios.length,
            itemListElement: portfolios.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.title,
                url: p.external_url ?? undefined,
            })),
        },
    };

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                {!seo.indexing_enabled && <meta name="robots" content="noindex,nofollow" />}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                {seo.default_og_image && <meta property="og:image" content={seo.default_og_image} />}
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
            </Head>

            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <AmbientBackground blobsEnabled={visual.blobs_enabled} grainEnabled={visual.grain_enabled} />
            <ScrollProgress />
            <SiteNav identity={identity} whatsappUrl={whatsappUrl} currentPage="portfolio" />

            <main id="main-content" className="archive">
                <header className="archive-hero wrap">
                    <Link href="/" className="archive-back" data-reveal>
                        <span aria-hidden="true">←</span> Back to home
                    </Link>
                    <div className="archive-eyebrow" data-reveal>
                        The Archive
                    </div>
                    <h1 className="archive-title" data-reveal>
                        Every cut, <span className="grad-text">every story.</span>
                    </h1>
                    <p className="archive-lead" data-reveal>
                        The complete body of work — short-form, long-form and commercial edits for creators and brands.
                        Every view count comes straight from the client&rsquo;s own account.
                    </p>

                    <dl className="archive-stats" data-reveal>
                        <div>
                            <dt>Projects</dt>
                            <dd>{pad(portfolios.length)}</dd>
                        </div>
                        <div>
                            <dt>Short-Form</dt>
                            <dd>{pad(formats.find((f) => f.format === 'short')?.count ?? 0)}</dd>
                        </div>
                        <div>
                            <dt>Long-Form</dt>
                            <dd>{pad(formats.find((f) => f.format === 'long')?.count ?? 0)}</dd>
                        </div>
                        {categoryCount > 0 && (
                            <div>
                                <dt>Categories</dt>
                                <dd>{pad(categoryCount)}</dd>
                            </div>
                        )}
                        <div>
                            <dt>Based in</dt>
                            <dd className="archive-stat-text">{identity.location || 'Worldwide'}</dd>
                        </div>
                    </dl>
                </header>

                {portfolios.length === 0 ? (
                    <div className="wrap">
                        <div className="portfolio-empty" role="status">
                            New work is being prepared. Check back soon.
                        </div>
                    </div>
                ) : (
                    <>
                        {spotlight.length > 0 && (
                            <section className="archive-spotlight wrap" aria-label="Featured projects">
                                {spotlight.map((item) => (
                                    <SpotlightCard key={item.id} item={item} number={numberOf(item)} />
                                ))}
                            </section>
                        )}

                        <div className="archive-toolbar">
                            <div className="wrap archive-toolbar-inner">
                                <div className="filters archive-filters" role="group" aria-label="Filter by format">
                                    <button
                                        type="button"
                                        className="filter-pill"
                                        aria-pressed={filter === 'all'}
                                        onClick={() => changeFilter('all')}
                                    >
                                        All <sup>{portfolios.length}</sup>
                                    </button>
                                    {formats.map(({ format, count }) => (
                                        <button
                                            key={format}
                                            type="button"
                                            className="filter-pill"
                                            aria-pressed={filter === format}
                                            onClick={() => changeFilter(format)}
                                        >
                                            {FORMAT_LABELS[format]} <sup>{count}</sup>
                                        </button>
                                    ))}
                                </div>

                                <div className="view-toggle" role="group" aria-label="Layout">
                                    <button
                                        type="button"
                                        aria-pressed={view === 'grid'}
                                        onClick={() => changeView('grid')}
                                        aria-label="Grid view"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <rect x="1" y="1" width="6" height="6" rx="1.5" />
                                            <rect x="9" y="1" width="6" height="6" rx="1.5" />
                                            <rect x="1" y="9" width="6" height="6" rx="1.5" />
                                            <rect x="9" y="9" width="6" height="6" rx="1.5" />
                                        </svg>
                                        <span>Grid</span>
                                    </button>
                                    <button
                                        type="button"
                                        aria-pressed={view === 'index'}
                                        onClick={() => changeView('index')}
                                        aria-label="Index view"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <rect x="1" y="2" width="14" height="2" rx="1" />
                                            <rect x="1" y="7" width="14" height="2" rx="1" />
                                            <rect x="1" y="12" width="14" height="2" rx="1" />
                                        </svg>
                                        <span>Index</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <section className="archive-body wrap" aria-live="polite">
                            <p className="archive-count">
                                Showing <b>{filtered.length}</b> of {portfolios.length} projects
                                {filter !== 'all' && <> · {FORMAT_LABELS[filter as PortfolioFormat]}</>}
                            </p>

                            {filtered.length === 0 ? (
                                <div className="portfolio-empty" role="status">
                                    No work in this category yet.
                                </div>
                            ) : view === 'grid' ? (
                                gridItems.length > 0 && (
                                    <div className="portfolio-grid archive-grid">
                                        {gridItems.map((item, index) => (
                                            <div className="archive-grid-item" key={item.id}>
                                                <span className="archive-no">No. {pad(numberOf(item))}</span>
                                                <PortfolioCard item={item} index={index} />
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <IndexList items={filtered} numberOf={numberOf} />
                            )}
                        </section>
                    </>
                )}

                <CtaSection cta={cta} whatsappUrl={whatsappUrl} email={contact.email} />
            </main>

            <SiteFooter identity={identity} contact={contact} onHome={false} />
            <StickyWhatsapp text={cta.sticky_bar_text} whatsappUrl={whatsappUrl} />
        </>
    );
}
