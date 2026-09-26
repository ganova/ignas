import { useState } from 'react';
import type { PortfolioItem } from '@/types/public';
import { isVerticalPlatform, resolveVideoEmbed } from '@/lib/video-embed';
import VideoLightbox from './VideoLightbox';
import PlatformIcon from './PlatformIcon';

export type PortfolioFormat = 'short' | 'long';

export function portfolioFormat(platform: string): PortfolioFormat {
    return isVerticalPlatform(platform) ? 'short' : 'long';
}

/** Public label for a platform: its format, not the network name (the icon carries that). */
export function platformLabel(platform: string): string {
    return portfolioFormat(platform) === 'short' ? 'Short-Form' : 'Long-Form';
}

export function FormatBadge({ platform, className = 'badge-platform' }: { platform: string; className?: string }) {
    return (
        <span className={className}>
            <PlatformIcon platform={platform} />
            {platformLabel(platform)}
        </span>
    );
}

export function PortfolioMedia({ item }: { item: PortfolioItem }) {
    const [imageFailed, setImageFailed] = useState(false);
    const gradient = (
        <span
            className="thumb-bg"
            style={{ background: `linear-gradient(150deg,${item.gradient_from},${item.gradient_to})` }}
        />
    );

    if (item.thumbnail && !imageFailed) {
        return (
            <>
                {gradient}
                <img
                    className="thumb-bg thumb-img"
                    src={item.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={360}
                    height={520}
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                />
            </>
        );
    }

    // No cover image: an uploaded video can show its own opening frame instead.
    if (item.video_source === 'upload' && item.video_url) {
        return (
            <>
                {gradient}
                <video
                    className="thumb-bg thumb-img"
                    src={`${item.video_url}#t=0.5`}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    tabIndex={-1}
                />
            </>
        );
    }

    return gradient;
}

function playIcon(size: number) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D0D14" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

export default function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
    const [origin, setOrigin] = useState<DOMRect | null>(null);
    const label = platformLabel(item.platform);
    const embed = resolveVideoEmbed(item.video_url);
    const projectUrl = item.external_url ?? item.video_url ?? null;
    const hasLink = Boolean(projectUrl);
    const ctaLabel = embed ? 'Play video' : hasLink ? 'Watch project ↗' : 'Project details coming soon';

    const media = (
        <>
            <PortfolioMedia item={item} />
            <span className="thumb-scrim" aria-hidden="true" />
            {item.is_featured && <span className="badge-featured">Featured</span>}
            <FormatBadge platform={item.platform} />
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
                    <span className="thumb-cta">{ctaLabel}</span>
                </span>
            </span>
        </>
    );

    return (
        <article
            className={`portfolio-card is-${portfolioFormat(item.platform)} ${item.is_featured ? 'is-featured' : ''}`}
            data-launching={origin ? '' : undefined}
            data-reveal
            style={{ transitionDelay: `${(index % 4) * 60}ms` }}
        >
            {embed ? (
                <button
                    type="button"
                    className="portfolio-thumb portfolio-thumb-video"
                    aria-label={`Play video: ${item.title}`}
                    onClick={(e) => setOrigin(e.currentTarget.getBoundingClientRect())}
                >
                    {media}
                </button>
            ) : hasLink ? (
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

            {embed && origin && (
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
