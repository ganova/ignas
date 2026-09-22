import { useEffect, useRef } from 'react';

/**
 * Very light magnetic-hover effect: the element nudges a few pixels toward
 * the cursor while hovered. Only active for fine-pointer devices that allow
 * hover, and skipped entirely under prefers-reduced-motion — on touch it
 * would just be a distracting ghost translate with no cursor to chase.
 */
export function useMagnetic<T extends HTMLElement>(strength = 10) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!canHover || prefersReducedMotion) return;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
            el.style.transform = `translate(${x}px, ${y}px)`;
        };
        const onLeave = () => {
            el.style.transform = '';
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);

    return ref;
}
