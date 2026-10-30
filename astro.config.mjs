import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeMermaidKroki from './rehype-kroki.mjs';
import siteConfig from './src/data/site-config';
import { readdirSync, readFileSync } from 'node:fs';

// Sitemap data straight from note frontmatter: lastmod per note, and placeholder notes (no excerpt) left out.
const notes = new Map(
    readdirSync('./src/content/system-design')
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
            const src = readFileSync(`./src/content/system-design/${f}`, 'utf-8');
            const date = (key) => src.match(new RegExp(`^${key}:[ \\t]*['"]?([^'"\\r\\n]+)`, 'm'))?.[1];
            return [f.replace(/\.md$/, ''), { published: /^excerpt:/m.test(src), lastmod: date('updatedDate') ?? date('publishDate') }];
        })
);
const noteOf = (page) => notes.get(new URL(page).pathname.match(/^\/system-design\/([^/]+)\/?$/)?.[1]);

// https://astro.build/config
export default defineConfig({
    site: siteConfig.website,
    vite: {
        plugins: [tailwindcss()]
    },
    markdown: {
        processor: unified({
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeMermaidKroki, rehypeKatex, rehypeRaw]
        }),
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid']
        }
    },
    integrations: [
        mdx(),
        sitemap({
            // Keep in sync with pages that pass `noindex` to BaseLayout.
            filter: (page) =>
                !/\/(404|500|design-patterns|system-design\/platforms|system-design\/piyush-garg)\/?$/.test(page) &&
                noteOf(page)?.published !== false,
            serialize(item) {
                const lastmod = noteOf(item.url)?.lastmod;
                if (lastmod) item.lastmod = new Date(lastmod).toISOString();
                return item;
            }
        })
    ]
});
