import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ResolvedEmbed } from '@/lib/video-embed';

interface Props {
    embed: ResolvedEmbed;
    title: string;
    vertical?: boolean;
    /** Screen rect of the thumbnail that was clicked; the player grows out of it. */
    origin?: DOMRect | null;
    posterImage?: string | null;
    posterGradient?: string;
    onClose: () => void;
}

const OPEN_MS = 720;
const CLOSE_MS = 480;
const EASE_OPEN = 'cubic-bezier(.16,1,.3,1)';
const EASE_CLOSE = 'cubic-bezier(.7,0,.84,0)';

/** Transform that makes the stage (at its final rect) sit exactly over the origin rect. */
function flipFrom(origin: DOMRect, target: DOMRect): string {
    const dx = origin.left + origin.width / 2 - (target.left + target.width / 2);
    const dy = origin.top + origin.height / 2 - (target.top + target.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${origin.width / target.width}, ${origin.height / target.height})`;
}

/**
 * Rendered via a portal into document.body: portfolio cards sit inside
 * data-reveal wrappers that get a CSS transform during the scroll-in
 * animation, and a transformed ancestor turns position:fixed into
 * positioned-relative-to-that-ancestor instead of the viewport — so a
 * lightbox mounted in place would be clipped to the card instead of
 * covering the screen.
 */
export default function VideoLightbox({
    embed,
    title,
    vertical = false,
    origin = null,
    posterImage = null,
    posterGradient,
    onClose,
}: Props) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
    const [closing, setClosing] = useState(false);
    const reducedMotion = useRef(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage || reducedMotion.current) return;

        const target = stage.getBoundingClientRect();
        const from = origin ? flipFrom(origin, target) : 'translateY(40px) scale(.86)';

        stage.animate(
            [
                { transform: from, borderRadius: '28px', opacity: origin ? 1 : 0 },
                { transform: 'none', borderRadius: '22px', opacity: 1 },
            ],
            { duration: OPEN_MS, easing: EASE_OPEN, fill: 'both' },
        );
        backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: OPEN_MS * 0.8,
            easing: 'ease-out',
            fill: 'both',
        });
    }, [origin]);

    const close = useCallback(() => {
        if (closing) return;
        setClosing(true);

        const stage = stageRef.current;
        if (!stage || reducedMotion.current) {
            onClose();
            return;
        }

        stage.getAnimations().forEach((a) => a.cancel());
        const target = stage.getBoundingClientRect();
        const to = origin ? flipFrom(origin, target) : 'translateY(30px) scale(.9)';

        backdropRef.current?.getAnimations().forEach((a) => a.cancel());
        backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: CLOSE_MS,
            easing: 'ease-in',
            fill: 'forwards',
        });
        const anim = stage.animate(
            [
                { transform: 'none', opacity: 1 },
                { transform: to, opacity: origin ? 0.4 : 0 },
            ],
            { duration: CLOSE_MS, easing: EASE_CLOSE, fill: 'forwards' },
        );
        // Fallback: a backgrounded tab may never fire onfinish.
        const fallback = window.setTimeout(onClose, CLOSE_MS + 150);
        anim.onfinish = () => {
            window.clearTimeout(fallback);
            onClose();
        };
    }, [closing, onClose, origin]);

    // Some embeds never fire a usable load event (e.g. blocked third-party
    // frames), so the poster shouldn't be able to cover the player forever.
    useEffect(() => {
        const id = window.setTimeout(() => setReady(true), 4000);
        return () => window.clearTimeout(id);
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [close]);

    const posterStyle = posterImage
        ? { backgroundImage: `url("${posterImage}")` }
        : posterGradient
          ? { background: posterGradient }
          : undefined;

    return createPortal(
        <div
            className={`video-lightbox ${ready ? 'is-ready' : ''} ${closing ? 'is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className="video-lightbox-backdrop" ref={backdropRef} aria-hidden="true" onClick={close} />

            <p className="video-lightbox-title">
                <span className="video-lightbox-dot" aria-hidden="true" />
                {title}
            </p>
            <button type="button" className="video-lightbox-close" aria-label="Close video" onClick={close}>
                ×
            </button>

            <div className={`video-lightbox-stage ${vertical ? 'is-vertical' : ''}`} ref={stageRef}>
                <span className="video-lightbox-glow" aria-hidden="true" />
                <div className="video-lightbox-panel">
                    {embed.kind === 'iframe' ? (
                        <iframe
                            src={embed.src}
                            title={title}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            loading="eager"
                            onLoad={() => setReady(true)}
                        />
                    ) : (
                        <video
                            src={embed.src}
                            controls
                            autoPlay
                            playsInline
                            onCanPlay={() => setReady(true)}
                        />
                    )}

                    <div className="video-lightbox-poster" style={posterStyle} aria-hidden="true">
                        <span className="video-lightbox-loader">
                            <span />
                            <span />
                            <span />
                        </span>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
