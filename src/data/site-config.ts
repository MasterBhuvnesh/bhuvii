import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://bhuvneshverma.dev',
    title: 'Bhuvnesh Verma',
    subtitle: 'Product Engineer, Cloud-Native Builder, AI Systems Creator',
    description:
        'I design, build, and scale reliable systems used by real people. I work across web, mobile, cloud, and AI, automating repetitive work so teams ship faster, and making sure what goes live is stable and ready to grow.',
    image: {
        src: '/og.png',
        alt: 'Bhuvnesh Verma · Cloud-Native Full-Stack & AI Engineer'
    },
    headerNavLinks: [
        {
            text: 'System Design',
            href: '/system-design-roadmap/'
        }
        // {
        //     text: 'Design Patterns',
        //     href: '/design-patterns'
        // }
    ]
};

export default siteConfig;
