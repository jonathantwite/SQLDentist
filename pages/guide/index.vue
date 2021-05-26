<template>
    <div>
        <h2 class="mb-4">SQL Guide</h2>
        <article-listings :articles="articles"></article-listings>
    </div>
</template>

<script>
import ArticleListings, { fieldsForListing } from '~/components/ArticleListing.vue';
import { processContentArticle } from '~/code/content/contentHelpers';

export default {
    components: { ArticleListings },
    async asyncData({ $content, params }) {
        const articles = await $content('guide', params.slug)
            .only(fieldsForListing)
            .sortBy('createdAt', 'asc')
            .fetch();

        processContentArticle(articles);

        return {
            articles
        };
    },
    head() {
        return {
            title: this.$config.siteName + ' - SQL Guide'
        };
    }
};
</script>
