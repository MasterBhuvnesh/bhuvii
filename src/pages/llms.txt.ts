import type { APIContext } from 'astro';
import siteConfig, { bio } from '../data/site-config';

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants.
export function GET(context: APIContext) {
    const url = (path: string) => new URL(path, context.site).toString();
    const body = `# ${siteConfig.title}

> ${siteConfig.subtitle}. ${siteConfig.description}

${bio}

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
