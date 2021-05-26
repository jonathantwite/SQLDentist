<template>
    <div>
        <article class="blog-post">
            <h2 class="bog-post-title">{{ page.title }}</h2>
            <p class="lead blog-post-meta">{{ createdAtDisplay }}</p>

            <nuxt-content :document="page" />
        </article>
        <hr v-if="showRelated" />
        <related-articles v-if="showRelated" :articles="relatedArticles"></related-articles>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import articleSeo from '@/mixins/article-seo';
import codeBlock from '@/mixins/code-blocks';
import { loadRelatedArticles } from '@/code/content/contentHelpers';

export default {
    mixins: [codeBlock, articleSeo],
    async asyncData({ $content, params }) {
        const page = await $content(`guide/${params.slug}` || 'guide/index').fetch();
        const relatedArticles = await loadRelatedArticles($content, page);
        const showRelated = relatedArticles && relatedArticles.length > 0;

        return { page, relatedArticles, showRelated };
    },
    computed: {
        createdAtDisplay() {
            return dayjs(this.page.createdAt).format('dddd D MMMM YYYY');
        }
    }
};
</script>
