/**
 * Single source of truth for the scrollytelling sections shared by SiteNav
 * and ScrollTicks, so both always agree on order and labels.
 */
export interface SectionConfig {
    id: string;
    label: string;
    tick: string;
}

export const SECTIONS: SectionConfig[] = [
    { id: 'hero', label: 'Beranda', tick: '00:01' },
    { id: 'portfolio', label: 'Portfolio', tick: '00:02' },
    { id: 'layanan', label: 'Layanan', tick: '00:03' },
    { id: 'about', label: 'About', tick: '00:04' },
    { id: 'qna', label: 'QnA', tick: '00:05' },
];

export const NAV_SECTIONS = SECTIONS.filter((s) => s.id !== 'hero');
