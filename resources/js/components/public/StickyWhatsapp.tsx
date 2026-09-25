import { useEffect, useState } from 'react';

interface Props {
    text: string;
    whatsappUrl: string;
}

export default function StickyWhatsapp({ text, whatsappUrl }: Props) {
    const [dismissed, setDismissed] = useState(false);
    // Hero already has its own WhatsApp CTA button, so the sticky bar would
    // otherwise float on top of it (and the showreel) from the first frame.
    // It appears once the visitor has scrolled roughly past the hero.
    const [pastHero, setPastHero] = useState(false);

    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) {
            setPastHero(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => setPastHero(!entry?.isIntersecting), {
            rootMargin: '-90% 0px 0px 0px',
        });
        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    if (dismissed || !pastHero || !whatsappUrl) return null;

    return (
        <div className="wa-bar">
            <span className="wa-bar-text">{text}</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <b>Chat now</b>
            </a>
            <button type="button" className="wa-bar-close" aria-label="Dismiss" onClick={() => setDismissed(true)}>
                ×
            </button>
        </div>
    );
}
