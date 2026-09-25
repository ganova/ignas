import type { ServiceItem } from '@/types/public';

interface Props {
    services: ServiceItem[];
}

export default function ServicesSection({ services }: Props) {
    return (
        <section className="section" id="services">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    Services
                </div>
                <h2 data-reveal>What I can do for you.</h2>
                <div style={{ height: 14 }} />
                <div className="tiles" data-reveal data-reveal-stagger>
                    {services.map((service, index) => (
                        <div
                            className="service-tile"
                            key={service.number}
                            style={{ transitionDelay: `${index * 70}ms` }}
                        >
                            <div className="ic">{service.number}</div>
                            <h4>{service.title}</h4>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
