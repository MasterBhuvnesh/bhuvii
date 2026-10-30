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
            filter: (page) => !/\/(404|500|design-patterns)\/?$/.test(page)
        })
    ]
});
