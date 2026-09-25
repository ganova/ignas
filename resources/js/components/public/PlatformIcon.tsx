import { useId } from 'react';

interface Props {
    platform: string;
    size?: number;
}

/** Small platform glyph shown beside the Short-Form / Long-Form label. */
export default function PlatformIcon({ platform, size = 12 }: Props) {
    const gradientId = `ig-${useId().replace(/:/g, '')}`;

    switch (platform) {
        case 'instagram':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Instagram" role="img">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0" stopColor="#FEC053" />
                            <stop offset=".5" stopColor="#F2203E" />
                            <stop offset="1" stopColor="#7024C4" />
                        </linearGradient>
                    </defs>
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={`url(#${gradientId})`} strokeWidth="2.4" />
                    <circle cx="12" cy="12" r="4.3" stroke={`url(#${gradientId})`} strokeWidth="2.4" />
                    <circle cx="17.4" cy="6.6" r="1.4" fill="#F2203E" />
                </svg>
            );
        case 'youtube':
            return (
                <svg width={size * 1.3} height={size} viewBox="0 0 26 20" aria-label="YouTube" role="img">
                    <rect x="0" y="1" width="26" height="18" rx="5" fill="#FF0033" />
                    <path d="M10.5 6v8l6.8-4z" fill="#fff" />
                </svg>
            );
        case 'tiktok':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-label="TikTok" role="img">
                    <path
                        d="M14.5 2h3.1c.3 2.3 1.8 3.9 4.1 4.1v3.2c-1.5 0-2.9-.5-4.1-1.3v6.6A6.3 6.3 0 1 1 11.3 8.4v3.3a3.1 3.1 0 1 0 3.2 3V2z"
                        fill="#0D0D14"
                    />
                </svg>
            );
        default:
            return null;
    }
}
