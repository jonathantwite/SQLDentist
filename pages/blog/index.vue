<template>
    <div>
        <h2 class="mb-4">Blog Posts</h2>
        <blog-post-listings :articles="articles"></blog-post-listings>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import BlogPostListings from '~/components/BlogPostListings.vue';
export default {
    components: { BlogPostListings },
    async asyncData({ $content, params }) {
        const articles = await $content('blog', params.slug)
            .only(['title', 'description', 'img', 'slug', 'author', 'createdAt'])
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
