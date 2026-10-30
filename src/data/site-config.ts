import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://bhuvneshverma.dev',
    title: 'Bhuvnesh Verma',
    subtitle: 'Product Engineer, Cloud-Native Builder, AI Systems Creator',
    description:
        'I design, build, and scale reliable systems used by real people. I work across web, mobile, cloud, and AI, automating repetitive work so teams ship faster, and making sure what goes live is stable and ready to grow.',
    image: {
        src: '/og.png',
        alt: 'Bhuvnesh Verma · Product Engineer, Cloud-Native Builder, AI Systems Creator'
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

// Third-person bio for structured data and llms.txt, where AI answers quote it.
export const bio =
    "Bhuvnesh Verma is a product engineer, cloud-native builder and AI systems creator based in Nagpur, India. As contract lead developer of Western Coalfields Limited's examination platform, Bhuvnesh built a four-app system (an Electron kiosk client, Next.js admin and hall-ticket portals, and a Bun and Express API) that served about 530 candidates, was load-tested to 10,000 virtual users and runs on AWS infrastructure codified in Terraform. At Absolv Networking, Bhuvnesh works on a relationship-intelligence platform with Gmail and Calendar ingestion, a tiered contact knowledge graph and an MCP-based AI agent that drafts outreach for human review. Earlier, at Volvox, Bhuvnesh built a push-notification pipeline on Expo and AWS SNS and automated iOS and Android releases. Bhuvnesh works across web, mobile, cloud and AI, and publishes a free visual system design roadmap on this site.";

export default siteConfig;
