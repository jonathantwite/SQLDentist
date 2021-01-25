<template>
  <article>
    <nuxt-content :document="page" />
  </article>
</template>

<script>
export default {
    async asyncData({ $content, params }) {
        const page = await $content(`blog/${params.slug}` || 'blog/index').fetch();
        console.log(page);
        return { page };
    }
};
</script>
