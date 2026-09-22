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
                        <h2 style={{ textAlign: 'left' }}>Hi, I'm {identity.owner_name}.</h2>
                        <p className="about-lead">
                            Six years living inside the timeline. I believe good editing shouldn't be noticed —
                            viewers just realize they can't stop watching.
                        </p>
                        <p className="about-lead about-lead-2">
                            My focus isn't just cutting and arranging clips — it's designing the pacing, rhythm,
                            and retention moments that keep an audience watching until the end, then acting.
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
                    The Process
                </div>
                <h2 data-reveal>Four steps, no drama.</h2>
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
