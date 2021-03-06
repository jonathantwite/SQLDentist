<template>
    <article class="blog-post">
        <h2 class="bog-post-title">{{ page.title }}</h2>
        <p class="lead blog-post-meta">{{ createdAtDisplay }}</p>

        <nuxt-content :document="page" />
    </article>
</template>

<script>
import dayjs from 'dayjs';
import codeBlock from '@/mixins/code-blocks';
export default {
    mixins: [codeBlock],
    async asyncData({ $content, params }) {
        const page = await $content(`blog/${params.slug}` || 'blog/index').fetch();
        return { page };
    },
    computed: {
        createdAtDisplay() {
            return dayjs(this.page.createdAt).format('dddd D MMMM YYYY');
        }
    }
};
</script>
