import type { SiteSettings } from '@/types/public';
import { useMagnetic } from '@/hooks/useMagnetic';

interface Props {
    cta: SiteSettings['cta'];
    whatsappUrl: string;
    email: string;
}

export default function CtaSection({ cta, whatsappUrl, email }: Props) {
    const whatsappRef = useMagnetic<HTMLAnchorElement>();
    const emailRef = useMagnetic<HTMLAnchorElement>();

    return (
        <section className="section" id="cta">
            <div className="wrap">
                <div className="cta-panel" data-reveal>
                    <h2>{cta.heading}</h2>
                    <p>{cta.description}</p>
                    <div className="btns">
                        <a
                            className="btn btn-dark btn-magnetic"
                            ref={whatsappRef}
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {cta.whatsapp_button_label} ↗
                        </a>
                        {email && (
                            <a className="btn btn-glass btn-magnetic" ref={emailRef} href={`mailto:${email}`}>
                                {cta.email_button_label}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
