import { useState } from 'react';

interface Props {
    text: string;
    whatsappUrl: string;
}

export default function StickyWhatsapp({ text, whatsappUrl }: Props) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <div className="wa-bar">
            <span className="wa-bar-text">{text}</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <b>Chat sekarang</b>
            </a>
            <button type="button" className="wa-bar-close" aria-label="Sembunyikan" onClick={() => setDismissed(true)}>
                ×
            </button>
        </div>
    );
}
