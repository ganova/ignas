import { useEffect, useRef, useState } from 'react';

const NUMERIC_PATTERN = /^([^\d]*)(\d[\d.,]*)(.*)$/;

/**
 * Parses a stat string like "120+" or "4.8/5" into a prefix/number/suffix so
 * it can be animated as a count-up. Returns null when the value isn't a
 * simple leading-number pattern, so callers can fall back to rendering the
 * raw string unanimated instead of mangling it.
 */
function parseStat(value: string): { prefix: string; number: number; decimals: number; suffix: string } | null {
    const match = value.match(NUMERIC_PATTERN);
    if (!match) return null;

    const prefix = match[1] ?? '';
    const numStr = match[2] ?? '';
    const suffix = match[3] ?? '';
    const normalized = numStr.replace(/,/g, '');
    const number = parseFloat(normalized);
    if (Number.isNaN(number)) return null;

    const decimalPart = normalized.split('.')[1];
    return { prefix, number, decimals: decimalPart ? decimalPart.length : 0, suffix };
}

/** Animates a stat value's number from 0 once its container enters view. Falls back to the raw string if unparseable. */
export function useCountUp(value: string, active: boolean) {
    const parsed = parseStat(value);
    const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}0${parsed.suffix}` : value));
    const animated = useRef(false);

    useEffect(() => {
        if (!parsed || !active || animated.current) return;
        animated.current = true;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setDisplay(value);
            return;
        }

        const duration = 900;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = parsed.number * eased;
            setDisplay(`${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    return parsed ? display : value;
}
