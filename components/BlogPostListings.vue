<template>
    <ol class="blog-posts">
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
</template>

<script>
export default {
    props: {
        articles: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss">
ol.blog-posts {
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
