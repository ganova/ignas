import type { BrandItem } from '@/types/public';

function BrandMark({ brand }: { brand: BrandItem }) {
    const content = brand.logo_url ? (
        <img src={brand.logo_url} alt={brand.name} loading="lazy" decoding="async" />
    ) : (
        <span className="brand-wordmark">{brand.name}</span>
    );

    return brand.website_url ? (
        <a className="brand-mark" href={brand.website_url} target="_blank" rel="noopener noreferrer" title={brand.name}>
            {content}
        </a>
    ) : (
        <span className="brand-mark" title={brand.name}>
            {content}
        </span>
    );
}

/**
 * Endless logo marquee. The list is rendered twice back-to-back and the track
 * slides by exactly half its width, so the loop point is invisible.
 */
export default function BrandsSection({ brands }: { brands: BrandItem[] }) {
    if (brands.length === 0) return null;

    // Short lists would leave a gap mid-loop on wide screens; repeat them first.
    const base = brands.length < 6 ? [...brands, ...brands, ...brands] : brands;
    const duration = Math.max(24, base.length * 4);

    return (
        <section className="brands-section" aria-labelledby="brands-heading">
            <div className="wrap">
                <p className="brands-heading" id="brands-heading" data-reveal>
                    Brands &amp; creators I&apos;ve worked with
                </p>
            </div>
            <div className="marquee" data-reveal>
                <ul className="marquee-track" style={{ animationDuration: `${duration}s` }}>
                    {[...base, ...base].map((brand, i) => (
                        <li key={`${brand.id}-${i}`} aria-hidden={i >= base.length ? true : undefined}>
                            <BrandMark brand={brand} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
