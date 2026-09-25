import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { PortfolioItem } from '@/types/public';
import PortfolioCard, { portfolioFormat } from '@/components/public/PortfolioCard';
import PlatformIcon from '@/components/public/PlatformIcon';

interface Props {
    portfolios: PortfolioItem[];
    total: number;
}

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * Horizontally scrolling row of vertical cards. Lets the short-form showcase
 * grow to dozens of reels without turning the page into an endless grid.
 */
function ShortFormRail({ items }: { items: PortfolioItem[] }) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [edges, setEdges] = useState({ start: true, end: false });

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setEdges({
            start: el.scrollLeft <= 4,
            end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
        });
    }, []);

    useEffect(() => {
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [update, items.length]);

    function scrollByPage(dir: 1 | -1) {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
    }

    return (
        <div className={`rail ${edges.start ? 'at-start' : ''} ${edges.end ? 'at-end' : ''}`}>
            <div className="rail-track" ref={trackRef} onScroll={update} tabIndex={0} aria-label="Short-form videos">
                {items.map((item, index) => (
                    <PortfolioCard item={item} index={index} key={item.id} />
                ))}
            </div>
            <button
                type="button"
                className="rail-arrow rail-arrow-prev"
                aria-label="Scroll back"
                onClick={() => scrollByPage(-1)}
                disabled={edges.start}
            >
                <Arrow dir="prev" />
            </button>
            <button
                type="button"
                className="rail-arrow rail-arrow-next"
                aria-label="Scroll forward"
                onClick={() => scrollByPage(1)}
                disabled={edges.end}
            >
                <Arrow dir="next" />
            </button>
        </div>
    );
}

function FormatHeading({ title, note, icons, count }: { title: string; note: string; icons: string[]; count: number }) {
    return (
        <div className="format-head" data-reveal>
            <div className="format-head-title">
                <span className="format-head-icons" aria-hidden="true">
                    {icons.map((p) => (
                        <PlatformIcon key={p} platform={p} size={15} />
                    ))}
                </span>
                <h3>{title}</h3>
                <span className="format-head-count">{count}</span>
            </div>
            <p>{note}</p>
        </div>
    );
}

export default function PortfolioSection({ portfolios, total }: Props) {
    const shortForm = portfolios.filter((p) => portfolioFormat(p.platform) === 'short');
    const longForm = portfolios.filter((p) => portfolioFormat(p.platform) === 'long');

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

                {portfolios.length === 0 && (
                    <div className="portfolio-empty" role="status">
                        New work is on the way.
                    </div>
                )}

                {shortForm.length > 0 && (
                    <div className="format-block">
                        <FormatHeading
                            title="Short-Form"
                            note="Reels, TikToks & Shorts — built to stop the scroll."
                            icons={['instagram', 'tiktok']}
                            count={shortForm.length}
                        />
                        <ShortFormRail items={shortForm} />
                    </div>
                )}

                {longForm.length > 0 && (
                    <div className="format-block">
                        <FormatHeading
                            title="Long-Form"
                            note="YouTube videos, commercials & films — paced to keep people watching."
                            icons={['youtube']}
                            count={longForm.length}
                        />
                        <div className="longform-grid">
                            {longForm.map((item, index) => (
                                <PortfolioCard item={item} index={index} key={item.id} />
                            ))}
                        </div>
                    </div>
                )}

                {total > 0 && (
                    <div className="portfolio-more" data-reveal>
                        <Link href="/portfolio" className="btn-archive">
                            <span>View the full archive</span>
                            <span className="btn-archive-count">{total}</span>
                            <span className="btn-archive-arrow" aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
