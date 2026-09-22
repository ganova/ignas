import { useEffect } from 'react';

/**
 * Applies a one-time reveal animation to every [data-reveal] element on the
 * page. Runs once on mount (after Inertia/React has rendered all sections),
 * so it must be called from a component that lives above all sections, e.g.
 * the page component itself.
 *
 * If prefers-reduced-motion is set, or IntersectionObserver is unavailable,
 * every element is marked visible immediately instead of animating.
 */
export function useScrollReveal() {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
        if (elements.length === 0) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
            elements.forEach((el) => el.classList.add('in'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
