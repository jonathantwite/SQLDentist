<template>
    <div>
        <article class="blog-post">
            <h2 class="bog-post-title">{{ page.title }}</h2>
            <p class="lead blog-post-meta">{{ createdAtDisplay }}</p>

            <nuxt-content :document="page" />
        </article>
        <hr v-if="showRelated" />
        <article v-if="showRelated">
            <h3>Related</h3>
            <article-listing :articles="relatedArticles" show-area></article-listing>
        </article>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import codeBlock from '@/mixins/code-blocks';
import ArticleListing, { fieldsForListing } from '@/components/ArticleListing';
export default {
    components: {
        ArticleListing
    },
    mixins: [codeBlock],
    async asyncData({ $content, params }) {
        const page = await $content(`blog/${params.slug}` || 'blog/index').fetch();

        const relatedArticles = [];

        if (page.related) {
            for (const r of page.related) {
                const [dir, id] = r.split(' ');
                const idReg = '^' + id;

                relatedArticles.push(...await $content(dir)
                    .where({ slug: { $regex: [idReg] } })
                    .only(fieldsForListing)
                    .limit(1)
                    .fetch());
            }

            relatedArticles.forEach((a) => {
                a.createdAtDisplay = dayjs(a.createdAt).format('DD/MM/YY');
                a.area = /\/([^/]*)\/.*/.exec(a.path)[1];
            });
        }

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
