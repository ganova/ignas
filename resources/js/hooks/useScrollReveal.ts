import { useEffect } from 'react';

/**
 * Applies a one-time reveal animation to every [data-reveal] element on the
 * page, including ones rendered later (e.g. cards that appear after a filter
 * change) — without that, newly mounted elements would stay at opacity 0.
 * Call it once from the page component.
 *
 * If prefers-reduced-motion is set, or IntersectionObserver is unavailable,
 * every element is marked visible immediately instead of animating.
 */
export function useScrollReveal() {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canAnimate = !prefersReducedMotion && typeof IntersectionObserver !== 'undefined';

        const observer = canAnimate
            ? new IntersectionObserver(
                  (entries, obs) => {
                      entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                              entry.target.classList.add('in');
                              obs.unobserve(entry.target);
                          }
                      });
                  },
                  { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
              )
            : null;

        const track = (root: ParentNode) => {
            root.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => {
                if (observer) {
                    observer.observe(el);
                } else {
                    el.classList.add('in');
                }
            });
        };

        track(document);

        const mutations = new MutationObserver((records) => {
            records.forEach((record) => {
                record.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;
                    if (node.matches('[data-reveal]:not(.in)')) {
                        if (observer) {
                            observer.observe(node);
                        } else {
                            node.classList.add('in');
                        }
                    }
                    track(node);
                });
            });
        });
        mutations.observe(document.body, { childList: true, subtree: true });

        return () => {
            mutations.disconnect();
            observer?.disconnect();
        };
    }, []);
}
