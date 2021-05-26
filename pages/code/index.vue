<template>
    <div>
        <h2 class="mb-4">Help yourself</h2>
        <article-listings :articles="articles"></article-listings>
    </div>
</template>

<script>
import ArticleListings, { fieldsForListing } from '~/components/ArticleListing.vue';
import { processContentArticle } from '~/code/content/contentHelpers';

export default {
    components: { ArticleListings },
    async asyncData({ $content, params }) {
        const articles = await $content('code', params.slug)
            .only(fieldsForListing)
            .sortBy('createdAt', 'desc')
            .fetch();

        processContentArticle(articles);

        return {
            articles
        };
    },
    head() {
        return {
            title: this.$config.siteName + ' - Help yourself'
        };
    }
};
</script>
