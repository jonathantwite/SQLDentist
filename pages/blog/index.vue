<template>
    <div>
        <h2 class="mb-4">Blog Posts</h2>
        <article-listings :articles="articles"></article-listings>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import ArticleListings from '~/components/ArticleListing.vue';
export default {
    components: { ArticleListings },
    async asyncData({ $content, params }) {
        const articles = await $content('blog', params.slug)
            .only(['title', 'description', 'img', 'slug', 'author', 'createdAt', 'path'])
            .sortBy('createdAt', 'desc')
            .fetch();

        articles.forEach((a) => {
            console.log(a);
            a.createdAtDisplay = dayjs(a.createdAt).format('DD/MM/YY');
        });

        return {
            articles
        };
    }
};
</script>
