export interface ResolvedEmbed {
    kind: 'iframe' | 'video';
    src: string;
}

/**
 * Turns a pasted share link (Google Drive, YouTube, Vimeo) or a direct file
 * URL into something that can actually be embedded and played in place.
 * Google Drive's normal "view" link renders a full HTML page meant to be
 * opened standalone — embedding that URL directly in an iframe just shows a
 * "refused to connect" wall, so it has to be rewritten to the /preview form.
 */
export function isVerticalPlatform(platform: string): boolean {
    return platform === 'tiktok' || platform === 'instagram';
}

export function resolveVideoEmbed(url: string | null | undefined): ResolvedEmbed | null {
    if (!url) return null;

    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch) {
        return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
    }

    const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([\w-]+)/);
    if (driveOpenMatch) {
        return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview` };
    }

    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
    if (ytMatch) {
        return { kind: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    if (vimeoMatch) {
        return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
    }

    return { kind: 'video', src: url };
}
