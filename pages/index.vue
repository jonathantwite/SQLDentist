<template>
    <div>
        <p><em>Welcome to SQL at the Dentist</em></p>

        <p>For full-stack or web/application developers, making a database run quickly and feel like wrestling water - a futile exercise in trial-and-error in which seemingly innocuous changes cause massive performance gains or losses, whereas clever ideas and reworks often lead to little-to-no gain.</p>

        <p>As a full-stack developer, I have been learning on-the-job how to optimise database work and this website is place for me to articulate the tricks, processes and methods that I have learnt on my journey.  The content is aimed at developers who want performant applications rather than DBAs who look after servers, although there is an amount of crossover.</p>

        <p>The <NuxtLink to="/Guide">Guide</NuxtLink> contains a series of beginner-to-intermediate level articles that use the analogy of a Dentist's reception (hence the website's name) to illustrate concepts with regards to a SQL Server database.</p>

        <p>The <NuxtLink to="/blog">Blog</NuxtLink> is a place for me to articulate some idea or issue that I have come across.  Working with legacy code often leads to a wide range and variety of issues, so expect topics to be varied.</p>

        <p>The <NuxtLink to="/code">Help Yourself</NuxtLink> is a collection of useful snippets, often borrowed from elsewhere, collated into one place.  The <NuxtLink to="/">Sweet Treats</NuxtLink> are things I have discovered that are possible, but probably not wise to do.</p>

        <h2 class="mb-4">Latest from site</h2>
        <article-listings :articles="posts" show-area></article-listings>
    </div>
</template>

<script>
import ArticleListings, { fieldsForListing } from '~/components/ArticleListing.vue';
import { processContentArticle } from '~/code/content/contentHelpers';

export default {
    components: { ArticleListings },
    async asyncData({ $content, params }) {
        const posts = await $content('blog', params.slug)
            .only(fieldsForListing)
            .sortBy('createdAt', 'desc')
            .limit(2)
            .fetch();

        const codePosts = await $content('code', params.slug)
            .only(fieldsForListing)
            .sortBy('createdAt', 'desc')
            .limit(2)
            .fetch();

        posts.push(...codePosts);

        processContentArticle(posts);

        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return {
            posts: posts.slice(0, 3)
        };
    }
};
</script>
