<template>
    <div class="row">
        <div class="col-md-8 blog-main">
            <article class="blog-post">
                <h2 class="bog-post-title">{{ page.title }}</h2>
                <p class="blog-post-meta">{{ createdAtDisplay }}</p>

                <nuxt-content :document="page" />
            </article>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    async asyncData({ $content, params }) {
        const page = await $content(`blog/${params.slug}` || 'blog/index').fetch();
        return { page };
    },
    computed: {
        createdAtDisplay() {
            return dayjs(this.createdAt).format('dddd D MMMM YYYY');
        }
    }
};
</script>
