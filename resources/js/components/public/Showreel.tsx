import { useState } from 'react';
import type { SiteSettings } from '@/types/public';
import { autoThumbnailFromVideoUrl, resolveVideoEmbed } from '@/lib/video-embed';

interface Props {
    showreel: SiteSettings['showreel'];
}

/**
 * The player is never rendered until the visitor presses play, so the initial
 * page load never fetches the showreel — only a poster/gradient placeholder.
 *
 * An uploaded file wins over a link. Links to Google Drive / YouTube / Vimeo
 * are pages, not video files, so they play through their embed player.
 */
export default function Showreel({ showreel }: Props) {
    const [playing, setPlaying] = useState(false);
    const [posterFailed, setPosterFailed] = useState(false);

    if (!showreel.is_published) return null;

    const source = showreel.video_file_url || showreel.video_url || null;
    const embed = resolveVideoEmbed(source);
    const hasVideo = Boolean(embed);
    // A Drive/YouTube page link pasted into the poster field is turned into its preview image.
    const poster =
        (showreel.poster ? (autoThumbnailFromVideoUrl(showreel.poster) ?? showreel.poster) : null) ||
        (!showreel.video_file_url ? autoThumbnailFromVideoUrl(showreel.video_url) : null);

    return (
        <div className={`reel ${!hasVideo ? 'reel-empty' : ''} ${playing ? 'is-playing' : ''}`} id="reel">
            {poster && !playing && !posterFailed && (
                <img
                    className="reel-poster"
                    src={poster}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setPosterFailed(true)}
                />
            )}

            {playing && embed ? (
                embed.kind === 'iframe' ? (
                    <iframe
                        src={embed.src}
                        title={showreel.title}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video src={embed.src} poster={poster ?? undefined} controls autoPlay playsInline preload="none" />
                )
            ) : hasVideo ? (
                <button className="reel-play" id="reel-play" aria-label="Play showreel" onClick={() => setPlaying(true)}>
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
            {!playing && (
                <span className="reel-cap">
                    {hasVideo ? `${showreel.title} · ${showreel.duration}` : 'SHOWREEL · COMING SOON'}
                </span>
            )}
        </div>
    );
}
