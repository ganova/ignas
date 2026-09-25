import type { PortfolioItem } from '@/types/public';

export const PLATFORM_LABELS: Record<PortfolioItem['platform'], string> = {
    tiktok: 'TIKTOK',
    instagram: 'IG REELS',
    youtube: 'YOUTUBE',
    commercial: 'COMMERCIAL',
    other: 'OTHER',
};

export function platformLabel(platform: string): string {
    return PLATFORM_LABELS[platform as PortfolioItem['platform']] ?? platform.toUpperCase();
}

export function PortfolioMedia({ item }: { item: PortfolioItem }) {
    return item.thumbnail ? (
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
    );
}

function playIcon(size: number) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D0D14" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

export default function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
    const label = platformLabel(item.platform);
    const projectUrl = item.external_url ?? item.video_url ?? null;
    const hasLink = Boolean(projectUrl);

    const media = (
        <>
            <PortfolioMedia item={item} />
            <span className="thumb-scrim" aria-hidden="true" />
            {item.is_featured && <span className="badge-featured">Featured</span>}
            <span className="badge-platform">{label}</span>
            {item.duration && <span className="badge-duration">{item.duration}</span>}

            {hasLink && (
                <span className="thumb-play">
                    <span>{playIcon(14)}</span>
                </span>
            )}

            <span className="thumb-overlay">
                <span className="thumb-overlay-top">
                    {item.views_label && <span className="thumb-stat">{item.views_label} views</span>}
                    {item.duration && <span className="thumb-stat">{item.duration}</span>}
                </span>
                <span className="thumb-overlay-bottom">
                    <b>{item.title}</b>
                    <span className="thumb-overlay-meta">
                        {label}
                        {item.category ? ` · ${item.category}` : ''}
                    </span>
                    <span className="thumb-cta">{hasLink ? 'Watch project ↗' : 'Project details coming soon'}</span>
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
                    href={projectUrl as string}
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
