import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { PortfolioItem } from '@/types/public';
import PortfolioCard, { platformLabel } from '@/components/public/PortfolioCard';

interface Props {
    portfolios: PortfolioItem[];
    total: number;
}

export default function PortfolioSection({ portfolios, total }: Props) {
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
                            {platformLabel(platform)}
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
