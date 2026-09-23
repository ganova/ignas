import { Head } from '@inertiajs/react';
import '../../../css/glass-reel.css';
import type { HomePageProps } from '@/types/public';
import AmbientBackground from '@/components/public/AmbientBackground';
import ScrollTicks from '@/components/public/ScrollTicks';
import SiteNav from '@/components/public/SiteNav';
import Hero from '@/components/public/Hero';
import PortfolioSection from '@/components/public/PortfolioSection';
import ServicesSection from '@/components/public/ServicesSection';
import AboutSection from '@/components/public/AboutSection';
import QnaSection from '@/components/public/QnaSection';
import CtaSection from '@/components/public/CtaSection';
import StickyWhatsapp from '@/components/public/StickyWhatsapp';
import SiteFooter from '@/components/public/SiteFooter';
import ScrollProgress from '@/components/public/ScrollProgress';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Home({ settings, whatsappUrl, portfolios, portfolioTotal, services, processSteps, faqs }: HomePageProps) {
    const { identity, hero, showreel, contact, cta, visual, seo } = settings;

    useScrollReveal();

    const title = seo.default_site_title;
    const description = seo.default_meta_description;
    const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '/';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: identity.portfolio_name,
        founder: identity.owner_name,
        description,
        image: seo.default_og_image ?? undefined,
        address: identity.location || undefined,
        sameAs: [contact.instagram, contact.youtube, contact.behance, contact.tiktok].filter(Boolean),
    };

    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                {!seo.indexing_enabled && <meta name="robots" content="noindex,nofollow" />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                {seo.default_og_image && <meta property="og:image" content={seo.default_og_image} />}

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                {seo.default_og_image && <meta name="twitter:image" content={seo.default_og_image} />}

                <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
            </Head>

            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <AmbientBackground blobsEnabled={visual.blobs_enabled} grainEnabled={visual.grain_enabled} />
            <ScrollProgress />
            <ScrollTicks />
            <SiteNav identity={identity} whatsappUrl={whatsappUrl} />

            <main id="main-content">
                <Hero hero={hero} showreel={showreel} whatsappUrl={whatsappUrl} />
                <PortfolioSection portfolios={portfolios} total={portfolioTotal} />
                <ServicesSection services={services} />
                <AboutSection identity={identity} processSteps={processSteps} />
                <QnaSection faqs={faqs} />
                <CtaSection cta={cta} whatsappUrl={whatsappUrl} email={contact.email} />
            </main>

            <SiteFooter identity={identity} contact={contact} />

            <StickyWhatsapp text={cta.sticky_bar_text} whatsappUrl={whatsappUrl} />
        </>
    );
}
