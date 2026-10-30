import type { APIContext } from 'astro';
import siteConfig from '../data/site-config';

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants.
export function GET(context: APIContext) {
    const url = (path: string) => new URL(path, context.site).toString();
    const body = `# ${siteConfig.title}

> ${siteConfig.subtitle}. ${siteConfig.description}

Bhuvnesh Verma is a cloud-native full-stack and AI engineer based in Nagpur, India. This site is Bhuvnesh's portfolio and a system design learning roadmap.

- GitHub: https://github.com/MasterBhuvnesh
- LinkedIn: https://www.linkedin.com/in/bhuvneshverma/
- Email: hello@bhuvneshverma.dev

## Pages

- [Portfolio](${url('/')}): projects, experience, testimonials, skills and contact
- [System Design Roadmap](${url('/system-design-roadmap/')}): visual roadmap of what to learn in system design and in what order

## Optional

- [Sitemap](${url('/sitemap-index.xml')})
`;
    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
