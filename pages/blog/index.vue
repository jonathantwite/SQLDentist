<template>
    <div>
        <h2 class="mb-4">Blog Posts</h2>
        <article-listings :articles="articles"></article-listings>
    </div>
</template>

<script>
import ArticleListings, { fieldsForListing } from '~/components/ArticleListing.vue';
import { processContentArticle } from '~/code/content/contentHelpers';

export default {
    components: { ArticleListings },
    async asyncData({ $content, params }) {
        const articles = await $content('blog', params.slug)
            .only(fieldsForListing)
            .sortBy('createdAt', 'desc')
            .fetch();

        processContentArticle(articles);

        return {
            articles
        };
    }
};
</script>
