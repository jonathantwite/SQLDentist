<template>
    <div>
        <header class="blog-header py-3">
            <div class="row flex-nowrap justify-content-between align-items-center">
                <div class="d-none d-md-block col-md-3 pt-1"></div>
                <div class="col-12 col-md-5 text-center">
                    <!-- <NuxtLink class="blog-header-logo text-dark" to="/blog">SQL at the Dentist</NuxtLink> -->
                    <h1 class="blog-header-logo text-dark">SQL at the Dentist</h1>
                    <p class="lead mt-3 mb-0">Microsoft SQL Server without pulling your teeth out</p>
                </div>
                <div class="d-none d-md-block col-md-3 d-flex justify-content-end align-items-center"></div>
            </div>
        </header>

        <div class="nav-scroller blog-header py-1 mb-2">
            <nav class="nav d-flex justify-content-around">
                <NuxtLink class="p-2 text-muted" to="/">Home</NuxtLink>
                <NuxtLink class="p-2 text-muted" to="/Guide">Guide</NuxtLink>
                <NuxtLink class="p-2 text-muted" to="/blog">Blog</NuxtLink>
                <NuxtLink class="p-2 text-muted" to="/code">Help Yourself</NuxtLink>
                <NuxtLink class="p-2 text-muted" to="/sweet-treats">Sweet Treats</NuxtLink>
            </nav>
        </div>
    </div>
</template>

<style lang="scss">
.nav-scroller a:not(:hover) {
    text-decoration: none;
}
</style>
