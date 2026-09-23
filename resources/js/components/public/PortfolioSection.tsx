import { useMemo, useState } from 'react';
import type { PortfolioItem } from '@/types/public';

interface Props {
    portfolios: PortfolioItem[];
}

const PLATFORM_LABELS: Record<PortfolioItem['platform'], string> = {
    tiktok: 'TIKTOK',
    instagram: 'IG REELS',
    youtube: 'YOUTUBE',
    commercial: 'COMMERCIAL',
    other: 'OTHER',
};

function playIcon(size: number) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D0D14" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
    const platformLabel = PLATFORM_LABELS[item.platform] ?? item.platform.toUpperCase();
    const hasLink = Boolean(item.external_url);

    const media = (
        <>
            {item.thumbnail ? (
                <img
                    className="thumb-bg thumb-img"
                    src={item.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={360}
                    height={520}
                />
            ) : (
                <span
                    className="thumb-bg"
                    style={{ background: `linear-gradient(150deg,${item.gradient_from},${item.gradient_to})` }}
                />
            )}
            <span className="thumb-scrim" aria-hidden="true" />
            {item.is_featured && <span className="badge-featured">Featured</span>}
            <span className="badge-platform">{platformLabel}</span>
            {item.duration && <span className="badge-duration">{item.duration}</span>}

            <span className="thumb-play">
                <span>{playIcon(14)}</span>
            </span>

            <span className="thumb-overlay">
                <span className="thumb-overlay-top">
                    {item.views_label && <span className="thumb-stat">{item.views_label} views</span>}
                    {item.duration && <span className="thumb-stat">{item.duration}</span>}
                </span>
                <span className="thumb-overlay-bottom">
                    <b>{item.title}</b>
                    <span className="thumb-overlay-meta">
                        {platformLabel}
                        {item.category ? ` · ${item.category}` : ''}
                    </span>
                    <span className="thumb-cta">{hasLink ? 'Watch project ↗' : 'Details coming soon'}</span>
                </span>
            </span>
        </>
    );

    return (
        <article
            className={`portfolio-card ${item.is_featured ? 'is-featured' : ''}`}
            data-reveal
            style={{ transitionDelay: `${(index % 4) * 60}ms` }}
        >
            {hasLink ? (
                <a
                    className="portfolio-thumb"
                    href={item.external_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View project ${item.title} (opens in new tab)`}
                >
                    {media}
                </a>
            ) : (
                <div
                    className="portfolio-thumb portfolio-thumb-static"
                    aria-label={`${item.title} — link not available yet`}
                >
                    {media}
                </div>
            )}
            <div className="portfolio-meta">
                <h4>{item.title}</h4>
                <p>
                    {item.views_label && <b>{item.views_label} views</b>}
                    {item.views_label && item.category ? ' · ' : ''}
                    {item.category}
                </p>
            </div>
        </article>
    );
}

export default function PortfolioSection({ portfolios }: Props) {
    // Filter options are derived from the actual data, not a hard-coded list,
    // so a new platform used in the admin automatically appears as a filter.
    const platforms = useMemo(() => {
        const seen = new Set<string>();
        return portfolios.map((p) => p.platform).filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
    }, [portfolios]);

    const [activeFilter, setActiveFilter] = useState<string>('all');

    const visible = activeFilter === 'all' ? portfolios : portfolios.filter((p) => p.platform === activeFilter);

    return (
        <section className="section" id="portfolio">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    Portfolio
                </div>
                <h2 data-reveal>Selected work.</h2>
                <p className="sub" data-reveal>
                    View counts below are pulled from each client&apos;s own account.
                </p>

                <div className="filters" role="group" aria-label="Portfolio filter" data-reveal>
                    <button
                        type="button"
                        className="filter-pill"
                        aria-pressed={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    >
                        All
                    </button>
                    {platforms.map((platform) => (
                        <button
                            key={platform}
                            type="button"
                            className="filter-pill"
                            aria-pressed={activeFilter === platform}
                            onClick={() => setActiveFilter(platform)}
                        >
                            {PLATFORM_LABELS[platform as PortfolioItem['platform']] ?? platform}
                        </button>
                    ))}
                </div>

                {visible.length > 0 ? (
                    <div className="portfolio-grid" role="status" aria-live="polite">
                        {visible.map((item, index) => (
                            <PortfolioCard item={item} index={index} key={item.id} />
                        ))}
                    </div>
                ) : (
                    <div className="portfolio-empty" role="status">
                        No work in this category yet.
                    </div>
                )}
            </div>
        </section>
    );
}
