<template>
    <article>
        <h2 class="mb-4">Related</h2>
        <article-listing :articles="articles" show-area></article-listing>
    </article>
</template>

<script>
import { listingPropValidator } from './ArticleListing.vue';

export default {
    props: {
        articles: {
            type: Array,
            default: () => [],
            validator: listingPropValidator
        }
    }
};
</script>
