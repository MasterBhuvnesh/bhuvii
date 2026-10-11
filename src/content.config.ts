import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection, type ImageFunction } from 'astro:content';

const imageSchema = (image: ImageFunction) =>
    z.object({
        src: image(),
        alt: z.string().optional()
    });

const seoSchema = (image: ImageFunction) =>
    z.object({
        title: z.string().min(5).max(120).optional(),
        description: z.string().min(15).max(160).optional(),
        image: imageSchema(image).optional(),
        pageType: z.enum(['website', 'article']).optional()
    });

const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            seo: seoSchema(image).optional()
        })
});

const systemDesign = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/system-design' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            excerpt: z.string().optional(),
            section: z.string(),
            publishDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            seo: seoSchema(image).optional()
        })
});

export const collections = { pages, systemDesign };
