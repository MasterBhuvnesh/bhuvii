import { type CollectionEntry } from 'astro:content';

export function sortItemsByDateDesc(itemA: CollectionEntry<'systemDesign'>, itemB: CollectionEntry<'systemDesign'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

// Placeholder notes ("Full notes coming soon.") ship without an excerpt; keep them out of search indexes.
export function isPublished(item: CollectionEntry<'systemDesign'>) {
    return Boolean(item.data.excerpt);
}
