import dayjs from 'dayjs';
import { fieldsForListing } from '@/components/ArticleListing';

/**
 * Load details of pages marked as related to a specific page.
 * @param {*} $content The Nuxt Content function.
 * @param {*} page A Nuxt Content page.
 * @returns Data for the ArticleListing component for related pages.
 */
export const loadRelatedArticles = async ($content, page) => {
    const relatedArticles = [];

    if (page.related) {
        for (const r of page.related) {
            const [dir, id] = r.split(' ');
            const idReg = '^' + id;

            relatedArticles.push(...await $content(dir)
                .where({ slug: { $regex: [idReg] } })
                .only(fieldsForListing)
                .limit(1)
                .fetch());
        }

        processContentArticle(relatedArticles);
    }

    return relatedArticles;
};

/**
 * Add the extra required properties to a Nuxt Content page or array of pages.
 * @param {*} article A Nuxt Content page, or array of pages.
 * @returns
 */
export const processContentArticle = (article) => {
    if (Array.isArray(article)) {
        article.forEach(a => processContentArticle(a));
        return;
    }

    article.createdAtDisplay = dayjs(article.createdAt).format('DD/MM/YY');
    const areaMatch = /\/([^/]*)\/.*/.exec(article.path);
    if (areaMatch && Array.isArray(areaMatch) && areaMatch.length >= 2) {
        article.area = areaMatch[1];
    }
};
