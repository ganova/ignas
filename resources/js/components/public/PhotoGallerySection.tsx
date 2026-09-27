import { useEffect, useState } from 'react';
import type { PhotoItem } from '@/types/public';

export default function PhotoGallerySection({ photos }: { photos: PhotoItem[] }) {
    const [active, setActive] = useState<PhotoItem | null>(null);

    useEffect(() => {
        if (!active) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setActive(null);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [active]);

    if (photos.length === 0) return null;

    return (
        <section className="section photo-gallery-section" aria-labelledby="photo-gallery-heading">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    Still Frames
                </div>
                <h2 id="photo-gallery-heading" data-reveal>
                    Photo work.
                </h2>
                <p className="sub" data-reveal>
                    A small selection of frames, moments, and visual stories.
                </p>
                <div className="photo-gallery-grid" data-reveal data-reveal-stagger>
                    {photos.map((photo, index) => (
                        <button
                            type="button"
                            className="photo-gallery-card"
                            key={photo.id}
                            onClick={() => setActive(photo)}
                            aria-label={`View photo: ${photo.title}`}
                            style={{ transitionDelay: `${(index % 6) * 55}ms` }}
                        >
                            <img
                                src={photo.image_url}
                                alt={photo.alt_text ?? photo.title}
                                loading="lazy"
                                decoding="async"
                                width="640"
                                height="800"
                            />
                            <span className="photo-gallery-caption">
                                <b>{photo.title}</b>
                                {photo.caption && <small>{photo.caption}</small>}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {active && (
                <div
                    className="photo-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.title}
                    onClick={() => setActive(null)}
                >
                    <button
                        type="button"
                        className="photo-lightbox-close"
                        onClick={() => setActive(null)}
                        aria-label="Close photo"
                    >
                        ×
                    </button>
                    <figure onClick={(event) => event.stopPropagation()}>
                        <img src={active.image_url} alt={active.alt_text ?? active.title} />
                        <figcaption>
                            <b>{active.title}</b>
                            {active.caption && <span>{active.caption}</span>}
                        </figcaption>
                    </figure>
                </div>
            )}
        </section>
    );
}
