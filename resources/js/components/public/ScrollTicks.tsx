import { useActiveSection } from '@/hooks/useActiveSection';
import { SECTIONS } from '@/lib/sections';

/**
 * Desktop-only left-side scroll indicator. Hidden on mobile via CSS
 * (see .ticks in glass-reel.css). Shares its section list and active-section
 * detection with SiteNav via useActiveSection, so both stay in sync.
 */
export default function ScrollTicks() {
    const activeId = useActiveSection();

    return (
        <div className="ticks" aria-hidden="true">
            {SECTIONS.map((section) => (
                <span key={section.id} className={section.id === activeId ? 'on' : undefined}>
                    {section.tick}
                </span>
            ))}
        </div>
    );
}
