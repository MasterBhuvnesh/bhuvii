import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config';
import { isPublished } from '../utils/data-utils';

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants.
export async function GET(context: APIContext) {
    const posts = (await getCollection('systemDesign', isPublished)).sort((a, b) => a.data.title.localeCompare(b.data.title));
    const url = (path: string) => new URL(path, context.site).toString();
    const body = `# ${siteConfig.title}

> ${siteConfig.subtitle}. ${siteConfig.description}

Bhuvnesh Verma is a cloud-native full-stack and AI engineer based in Nagpur, India. This site is Bhuvnesh's portfolio and a free, growing set of system design notes written in Bhuvnesh's own words.

- GitHub: https://github.com/MasterBhuvnesh
- LinkedIn: https://www.linkedin.com/in/bhuvneshverma/

## Key pages

- [Portfolio](${url('/')}): projects, experience, skills and contact
- [System Design](${url('/system-design/')}): index of all system design notes
- [System Design Fundamentals](${url('/system-design/fundamentals/')}): notes grouped by topic
- [System Design Roadmap](${url('/system-design-roadmap/')}): visual learning roadmap

## System design notes

${posts.map((p) => `- [${p.data.title}](${url(`/system-design/${p.id}/`)}): ${p.data.excerpt}`).join('\n')}

## Optional

- [RSS feed](${url('/rss.xml')})
- [Sitemap](${url('/sitemap-index.xml')})
`;
    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
