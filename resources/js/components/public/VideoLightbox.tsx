import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ResolvedEmbed } from '@/lib/video-embed';

interface Props {
    embed: ResolvedEmbed;
    title: string;
    vertical?: boolean;
    onClose: () => void;
}

/**
 * Rendered via a portal into document.body: portfolio cards sit inside
 * data-reveal wrappers that get a CSS transform during the scroll-in
 * animation, and a transformed ancestor turns position:fixed into
 * positioned-relative-to-that-ancestor instead of the viewport — so a
 * lightbox mounted in place would be clipped to the card instead of
 * covering the screen.
 */
export default function VideoLightbox({ embed, title, vertical = false, onClose }: Props) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    return createPortal(
        <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={title}>
            <button type="button" className="video-lightbox-backdrop" aria-label="Close video" onClick={onClose} />
            <div className={`video-lightbox-panel ${vertical ? 'is-vertical' : ''}`}>
                <button type="button" className="video-lightbox-close" aria-label="Close video" onClick={onClose}>
                    ×
                </button>
                {embed.kind === 'iframe' ? (
                    <iframe
                        src={embed.src}
                        title={title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        loading="eager"
                    />
                ) : (
                    <video src={embed.src} controls autoPlay playsInline />
                )}
            </div>
        </div>,
        document.body,
    );
}
