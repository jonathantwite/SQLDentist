<template>
    <ol class="article-posts">
        <li v-for="article of articles" :key="article.slug">
            <NuxtLink :to="article.path" class="pt-3">
                <img v-if="article.img" :src="article.img" :alt="article.description">
                <div class="article-summary text-dark pb-4">
                    <p class="h3">{{ article.title }}</p>
                    <p class="article-date lead small">{{ article.createdAtDisplay }}</p>
                    <!-- <p>by {{ article.author.name }}</p> -->
                    <p class="article-desc">{{ article.description }}</p>
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
    },
    mounted(){
        console.log(this.articles);
    }
};
</script>

<style lang="scss">
ol.article-posts {
    list-style: none;
    padding: 0;

    li {
        a:not(:hover) {
            text-decoration: none;
        }
        .article-summary {
            p {
                margin-bottom: 0;

                &.h3 {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>
