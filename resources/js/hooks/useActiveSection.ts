import { useEffect, useRef, useState } from 'react';
import { SECTIONS } from '@/lib/sections';

/**
 * Tracks which of SECTIONS is currently in view using a single shared
 * IntersectionObserver, so nav highlighting and the ScrollTicks indicator
 * never disagree. rootMargin biases toward the section crossing the upper
 * third of the viewport, which reads as "active" earlier than a strict
 * center crossing would.
 */
export function useActiveSection(): string {
    const [activeId, setActiveId] = useState<string>(SECTIONS[0]?.id ?? '');
    const ratios = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
            (el): el is HTMLElement => el !== null,
        );

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
                });

                let bestId = activeId;
                let bestRatio = 0;
                ratios.current.forEach((ratio, id) => {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                });
                if (bestRatio > 0) setActiveId(bestId);
            },
            { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return activeId;
}

const NAV_OFFSET = 90;

/** Smooth-scrolls to a section id, offsetting for the fixed navbar, and updates the URL hash without reloading. */
export function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    if (window.history?.pushState) {
        const url = id === 'hero' ? window.location.pathname + window.location.search : `#${id}`;
        window.history.pushState(null, '', url);
    }
}
