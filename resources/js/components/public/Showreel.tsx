import { useState } from 'react';
import type { SiteSettings } from '@/types/public';

interface Props {
    showreel: SiteSettings['showreel'];
}

/**
 * The video element is never rendered until the visitor presses play, so
 * the initial page load never fetches or preloads the showreel — only a
 * lightweight poster/gradient placeholder ships with the first response.
 */
export default function Showreel({ showreel }: Props) {
    const [playing, setPlaying] = useState(false);

    if (!showreel.is_published) return null;

    const hasVideo = Boolean(showreel.video_url);

    return (
        <div className={`reel ${!hasVideo ? 'reel-empty' : ''}`} id="reel">
            {showreel.poster && !playing && (
                <img className="reel-poster" src={showreel.poster} alt="" loading="lazy" decoding="async" />
            )}

            {playing && showreel.video_url ? (
                <video
                    src={showreel.video_url}
                    poster={showreel.poster ?? undefined}
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                />
            ) : hasVideo ? (
                <button
                    className="reel-play"
                    id="reel-play"
                    aria-label="Play showreel"
                    onClick={() => setPlaying(true)}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0D0D14" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            ) : (
                <div className="reel-soon" aria-hidden="true">
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0D0D14"
                        strokeWidth="1.6"
                        aria-hidden="true"
                    >
                        <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                        <path d="M8 6v12M16 6v12M4 10h4M4 14h4M16 10h4M16 14h4" />
                    </svg>
                </div>
            )}
            <span className="reel-cap">
                {showreel.title} · {showreel.duration}
            </span>
        </div>
    );
}
