import type { SiteSettings } from '@/types/public';
import { NAV_SECTIONS } from '@/lib/sections';
import { scrollToSection } from '@/hooks/useActiveSection';

interface Props {
    identity: SiteSettings['identity'];
    contact: SiteSettings['contact'];
}

const SOCIALS: { key: keyof SiteSettings['contact']; label: string }[] = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'behance', label: 'Behance' },
    { key: 'tiktok', label: 'TikTok' },
];

export default function SiteFooter({ identity, contact }: Props) {
    const socialLinks = SOCIALS.filter((s) => Boolean(contact[s.key]));

    return (
        <footer className="site-footer">
            <div className="wrap footer-grid">
                <div className="footer-brand">
                    <span className="footer-logo">{identity.logo_text}</span>
                    <p>{identity.profession}</p>
                    {identity.location && <p className="footer-location">📍 {identity.location}</p>}
                </div>

                <nav className="footer-nav" aria-label="Navigasi footer">
                    {NAV_SECTIONS.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(section.id);
                            }}
                        >
                            {section.label}
                        </a>
                    ))}
                </nav>

                {socialLinks.length > 0 && (
                    <div className="footer-social">
                        {socialLinks.map((social) => (
                            <a
                                key={social.key}
                                href={contact[social.key] as string}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <p className="footer-copyright">{identity.copyright}</p>
        </footer>
    );
}
