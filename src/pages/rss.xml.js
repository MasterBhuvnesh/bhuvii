import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';

export async function GET(context) {
    const posts = (await getCollection('systemDesign')).sort(sortItemsByDateDesc);
    const articles = posts.filter((item) => item.data.excerpt);
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        customData: `<language>en-us</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
        items: articles.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            link: `/system-design/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    });
}
