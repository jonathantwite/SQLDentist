<template>
    <ol class="article-posts">
        <li v-for="article of articles" :key="article.slug">
            <NuxtLink :to="article.path" class="pt-3">
                <img v-if="article.img" :src="article.img" :alt="article.description">
                <div class="article-summary text-dark pb-4">
                    <p><span class="h3 text-decoration-underline">{{ article.title }}</span><sup v-if="showArea" class="text-uppercase">&nbsp;[{{ article.area }}]</sup></p>
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
            default: () => [],
            validator(value) {
                return value.reduce((t, article) => t + (article.path && article.title && article.description && article.createdAtDisplay ? 0 : 1), 0) === 0;
            }
        },
        showArea: {
            type: Boolean,
            default: () => false
        }
    },
    mounted() {
        console.log(JSON.stringify(this.articles));
    }
};
</script>

<style lang="scss">
@import '../assets/scss/site.scss';

ol.article-posts {
    list-style: none;
    padding: 0;

    li {
        a:hover {
            text-decoration: $link-hover-decoration !important;
        }

        a {
            text-decoration: none;
        }

        .article-summary {
            p {
                margin-bottom: 0;

                .h3:not(:hover) {
                    text-decoration: $link-decoration;
                }

                .h3 {
                    sup {
                        font-size: 40%;
                        top: -1rem;
                        text-decoration: none !important;
                    }
                }
            }
        }
    }
}
</style>
