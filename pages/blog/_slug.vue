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
import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/components/prism-sql.js';
export default {
    async asyncData({ $content, params }) {
        const page = await $content(`blog/${params.slug}` || 'blog/index').fetch();
        return { page };
    },
    computed: {
        createdAtDisplay() {
            return dayjs(this.createdAt).format('dddd D MMMM YYYY');
        }
    },
    mounted(){
        Prism.highlightAll();
    }
};
</script>

<style>
pre[class*="language-"].line-numbers {
  position: relative;
  padding-left: 3.8em;
  counter-reset: linenumber;
}

pre[class*="language-"].line-numbers > code {
  position: relative;
  white-space: inherit;
}

.line-numbers .line-numbers-rows {
  position: absolute;
  pointer-events: none;
  top: -0.1em;
  font-size: 100%;
  left: -3.8em;
  width: 3em; /* works for line-numbers below 1000 lines */
  letter-spacing: -1px;
  /* border-right: 1px solid #999; */

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.line-numbers-rows > span {
  display: block;
  counter-increment: linenumber;
}

.line-numbers-rows > span:before {
  content: counter(linenumber);
  color: #999;
  display: block;
  padding-right: 0.8em;
  text-align: right;
}
.nuxt-content .nuxt-content-highlight {
    position: relative;
}

.nuxt-content .nuxt-content-highlight>.filename {
    position: absolute;
    right: 0;
    top: 0;
    /* color: rgba(247,250,252,var(--text-opacity)); */
    z-index: 10;
    font-family: DM Mono,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    font-size: .875rem;
    line-height: 1.25rem;
    letter-spacing: -.025em;
    line-height: 1;
    margin-right: 1rem;
    margin-top: .75rem;
}

.nuxt-content .nuxt-content-highlight>.filename+pre[class*=language-] {
    padding-top: 2rem;
}
</style>