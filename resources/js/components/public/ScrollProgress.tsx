import { useEffect, useState } from 'react';

/** Thin fixed progress bar reflecting how far the visitor has scrolled through the page. */
export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="scroll-progress" aria-hidden="true">
            <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />
        </div>
    );
}
