import type { ProcessStepItem, SiteSettings } from '@/types/public';

interface Props {
    identity: SiteSettings['identity'];
    processSteps: ProcessStepItem[];
}

export default function AboutSection({ identity, processSteps }: Props) {
    return (
        <section className="section" id="about">
            <div className="wrap">
                <div className="about-grid">
                    <div className="about-copy" data-reveal>
                        <div className="eyebrow" style={{ textAlign: 'left' }}>
                            About Me
                        </div>
                        <h2 style={{ textAlign: 'left' }}>Halo, saya {identity.owner_name}.</h2>
                        <p className="about-lead">
                            Enam tahun hidup di depan timeline. Saya percaya editing yang baik itu tidak terasa —
                            penonton cuma sadar mereka belum bisa berhenti nonton.
                        </p>
                        <p className="about-lead about-lead-2">
                            Fokus saya bukan sekadar memotong dan menyusun klip, tapi merancang pacing, ritme, dan momen
                            retensi yang membuat audiens bertahan sampai akhir — lalu bertindak.
                        </p>
                        {identity.location && <p className="about-location">📍 {identity.location}</p>}
                    </div>

                    <div className="about-portrait" data-reveal>
                        <div className="about-portrait-frame">
                            <span className="about-portrait-fallback" aria-hidden="true">
                                {identity.owner_name.charAt(0)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="eyebrow about-sub-heading" data-reveal>
                    Prosesnya
                </div>
                <h2 data-reveal>Empat langkah, tanpa drama.</h2>
                <div style={{ height: 22 }} />

                <div className="steps steps-timeline" data-reveal>
                    {processSteps.map((step, index) => (
                        <div
                            className="step-card"
                            key={step.step_number}
                            style={{ transitionDelay: `${index * 80}ms` }}
                        >
                            <div className="n">{step.label}</div>
                            <h4>{step.title}</h4>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
