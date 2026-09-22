import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/types/public';
import Showreel from './Showreel';
import { useCountUp } from '@/hooks/useCountUp';
import { useMagnetic } from '@/hooks/useMagnetic';

interface Props {
    hero: SiteSettings['hero'];
    showreel: SiteSettings['showreel'];
    whatsappUrl: string;
}

function StatCard({ value, label, active }: { value: string; label: string; active: boolean }) {
    const display = useCountUp(value, active);
    return (
        <div className="stat-card">
            <b>{display}</b>
            <i>{label}</i>
        </div>
    );
}

export default function Hero({ hero, showreel, whatsappUrl }: Props) {
    const [mounted, setMounted] = useState(false);
    const primaryCtaRef = useMagnetic<HTMLAnchorElement>();
    const secondaryCtaRef = useMagnetic<HTMLAnchorElement>();

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="wrap">
                {hero.availability_active && (
                    <div className={`pill hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '0ms' }}>
                        <span className="dot" aria-hidden="true" />
                        <span>{hero.availability_text}</span>
                    </div>
                )}

                <h1 className={`hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '80ms' }}>
                    {hero.heading}
                    <br />
                    <span className="grad-text">{hero.heading_gradient}</span> {hero.heading_suffix}
                </h1>

                <p className={`lead hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '160ms' }}>
                    {hero.description}
                </p>

                <div className={`btns hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '240ms' }}>
                    <a
                        className="btn btn-dark btn-magnetic"
                        ref={primaryCtaRef}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {hero.primary_button_label}
                    </a>
                    <a className="btn btn-glass btn-magnetic" ref={secondaryCtaRef} href="#reel">
                        {hero.showreel_button_label}
                    </a>
                </div>

                <div className={`stats hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '320ms' }}>
                    {hero.stats.map((stat) => (
                        <StatCard key={stat.label} value={stat.value} label={stat.label} active={mounted} />
                    ))}
                </div>

                <div className={`hero-stage ${mounted ? 'in' : ''}`} style={{ transitionDelay: '400ms' }}>
                    <Showreel showreel={showreel} />
                </div>
            </div>
        </section>
    );
}
