import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/types/public';
import { useActiveSection, scrollToSection } from '@/hooks/useActiveSection';
import { NAV_SECTIONS } from '@/lib/sections';

interface Props {
    identity: SiteSettings['identity'];
    whatsappUrl: string;
    /** Sub-pages link back to home sections instead of scrolling in place. */
    currentPage?: 'home' | 'portfolio';
}

export default function SiteNav({ identity, whatsappUrl, currentPage = 'home' }: Props) {
    const onHome = currentPage === 'home';
    const [boldPart, ...rest] = identity.logo_text.split('.');
    const mutedPart = rest.length ? '.' + rest.join('.') : '';

    const observedId = useActiveSection();
    const activeId = onHome ? observedId : currentPage;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const pillRef = useRef<HTMLDivElement | null>(null);
    // The indicator is absolutely positioned inside this container, so its
    // left offset must be measured against this box — not the outer pill,
    // which is inset by the logo's width.
    const linksRef = useRef<HTMLDivElement | null>(null);
    const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const menuPanelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Deep-link support: scroll to the hash target on first load.
    useEffect(() => {
        const hash = window.location.hash?.slice(1);
        if (hash) {
            requestAnimationFrame(() => scrollToSection(hash));
        }
    }, []);

    useLayoutEffect(() => {
        const recalc = () => {
            const activeLink = linkRefs.current[activeId];
            const container = linksRef.current;
            if (!activeLink || !container) {
                setIndicator(null);
                return;
            }
            // Measured against linksRef (the indicator's actual offsetParent),
            // not the outer pill — the pill also contains the logo, so using
            // its box would shift the indicator right by the logo's width.
            const containerRect = container.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            setIndicator({ left: linkRect.left - containerRect.left, width: linkRect.width });
        };

        recalc();

        // Nav-link widths can shift after this first measurement — most
        // commonly when the webfont finishes loading after the fallback
        // font already painted (FOUT) — which would otherwise leave the
        // indicator stuck at a stale, slightly-off position. ResizeObserver
        // and fonts.ready both re-trigger a recalc when that happens.
        const links = Object.values(linkRefs.current).filter((el): el is HTMLAnchorElement => el !== null);
        const resizeObserver = new ResizeObserver(recalc);
        links.forEach((link) => resizeObserver.observe(link));
        if (linksRef.current) resizeObserver.observe(linksRef.current);

        window.addEventListener('resize', recalc);
        document.fonts?.ready.then(recalc).catch(() => {});

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', recalc);
        };
    }, [activeId, menuOpen]);

    // Mobile menu: lock body scroll, close on Escape, restore focus to the trigger.
    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);

        const firstFocusable = menuPanelRef.current?.querySelector<HTMLElement>('a, button');
        firstFocusable?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    function handleNavClick(e: React.MouseEvent, id: string) {
        if (!onHome) return;
        e.preventDefault();
        scrollToSection(id);
        setMenuOpen(false);
    }

    function handleLogoClick(e: React.MouseEvent) {
        if (!onHome) return;
        e.preventDefault();
        scrollToSection('hero');
        setMenuOpen(false);
    }

    return (
        <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Main navigation">
            <div className="nav-pill" ref={pillRef}>
                <a className="nav-logo" href={onHome ? '#hero' : '/'} onClick={handleLogoClick}>
                    {boldPart}
                    <span className="muted">{mutedPart}</span>
                </a>

                <div className="nav-links-desktop" ref={linksRef}>
                    {indicator && (
                        <span
                            className="nav-indicator"
                            style={{ left: indicator.left, width: indicator.width }}
                            aria-hidden="true"
                        />
                    )}
                    {NAV_SECTIONS.map((section) => {
                        const isActive = section.id === activeId;
                        return (
                            <a
                                key={section.id}
                                ref={(el) => {
                                    linkRefs.current[section.id] = el;
                                }}
                                className={`nav-link ${isActive ? 'is-active' : ''}`}
                                href={onHome ? `#${section.id}` : `/#${section.id}`}
                                aria-current={isActive ? 'location' : undefined}
                                onClick={(e) => handleNavClick(e, section.id)}
                            >
                                {section.label}
                            </a>
                        );
                    })}
                </div>

                {whatsappUrl && (
                    <a
                        className="nav-link nav-cta nav-cta-desktop"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp
                    </a>
                )}

                <button
                    type="button"
                    className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav-panel"
                    onClick={() => setMenuOpen((v) => !v)}
                    ref={menuButtonRef}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            <div
                id="mobile-nav-panel"
                className={`nav-mobile-panel ${menuOpen ? 'is-open' : ''}`}
                ref={menuPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                hidden={!menuOpen}
            >
                <div className="nav-mobile-links">
                    {NAV_SECTIONS.map((section) => {
                        const isActive = section.id === activeId;
                        return (
                            <a
                                key={section.id}
                                className={`nav-mobile-link ${isActive ? 'is-active' : ''}`}
                                href={onHome ? `#${section.id}` : `/#${section.id}`}
                                aria-current={isActive ? 'location' : undefined}
                                onClick={(e) => handleNavClick(e, section.id)}
                            >
                                {section.label}
                            </a>
                        );
                    })}
                </div>
                {whatsappUrl && (
                    <a className="nav-cta nav-mobile-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        Chat via WhatsApp
                    </a>
                )}
            </div>

            {menuOpen && (
                <button
                    type="button"
                    className="nav-mobile-backdrop"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </nav>
    );
}
