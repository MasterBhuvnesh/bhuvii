import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://example.com',
    title: 'Bhuvii',
    subtitle: 'Minimal Astro.js theme',
    description: 'Astro.js and Tailwind CSS theme for blog and portfolio by justgoodui.com',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Bhuvii - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'System Design',
            href: '/system-design'
        }
    ]
};

export default siteConfig;
