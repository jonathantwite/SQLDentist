<template>
    <div>
        <h1>Blog Posts</h1>
        <ol>
            <li v-for="article of articles" :key="article.slug">
                <NuxtLink :to="'/blog/' + article.slug">
                    <img :src="article.img">
                    <div class="blog-summary text-dark">
                        <p class="h3">{{ article.title }}</p>
                        <p class="blog-date lead small">{{ article.createdAtDisplay }}</p>
                        <!-- <p>by {{ article.author.name }}</p> -->
                        <p class="blog-desc">{{ article.description }}</p>
                    </div>
                </NuxtLink>
            </li>
        </ol>
    </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
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

<style lang="scss" scoped>
ol {
    list-style: none;
    padding: 0;

    li {
        .blog-summary{
            p {
                margin-bottom: 0;

                &.h3{
                    text-decoration: underline;
                }
            }
        }
    }

}
</style>
