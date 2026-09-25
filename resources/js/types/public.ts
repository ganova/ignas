export interface HeroStat {
    value: string;
    label: string;
}

export interface SiteSettings {
    identity: {
        portfolio_name: string;
        owner_name: string;
        profession: string;
        copyright: string;
        location: string;
        logo_text: string;
        bio_paragraph_1: string;
        bio_paragraph_2: string;
    };
    hero: {
        availability_text: string;
        availability_active: boolean;
        heading: string;
        heading_gradient: string;
        heading_suffix: string;
        description: string;
        primary_button_label: string;
        showreel_button_label: string;
        stats: HeroStat[];
    };
    showreel: {
        title: string;
        duration: string;
        video_url: string | null;
        poster: string | null;
        is_published: boolean;
        autoplay: boolean;
    };
    contact: {
        whatsapp_number: string;
        whatsapp_message: string;
        email: string;
        instagram: string;
        youtube: string;
        behance: string;
        tiktok: string;
    };
    cta: {
        heading: string;
        description: string;
        whatsapp_button_label: string;
        email_button_label: string;
        sticky_bar_text: string;
    };
    visual: {
        accent_color: string;
        gradient: string;
        grain_enabled: boolean;
        blobs_enabled: boolean;
    };
    seo: {
        default_site_title: string;
        title_template: string;
        default_meta_description: string;
        default_og_image: string | null;
        indexing_enabled: boolean;
    };
}

export interface PortfolioItem {
    id: number;
    title: string;
    slug: string;
    platform: 'tiktok' | 'instagram' | 'youtube' | 'commercial' | 'other';
    category: string | null;
    duration: string | null;
    views_label: string | null;
    thumbnail: string | null;
    gradient_from: string;
    gradient_to: string;
    external_url: string | null;
    video_source?: 'link' | 'upload';
    video_url?: string | null;
    video_path?: string | null;
    is_featured?: boolean;
    description?: string | null;
    published_at?: string | null;
}

export interface ServiceItem {
    number: number;
    title: string;
    description: string;
}

export interface ProcessStepItem {
    step_number: number;
    label: string;
    title: string;
    description: string;
}

export interface FaqItem {
    id: number;
    question: string;
    answer: string | null;
    is_open_by_default: boolean;
}

export interface HomePageProps {
    settings: SiteSettings;
    whatsappUrl: string;
    portfolios: PortfolioItem[];
    portfolioTotal: number;
    services: ServiceItem[];
    processSteps: ProcessStepItem[];
    faqs: FaqItem[];
}

export interface PortfolioPageProps {
    settings: SiteSettings;
    whatsappUrl: string;
    portfolios: PortfolioItem[];
}
