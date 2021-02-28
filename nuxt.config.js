import getRoutes from './utils/getRoutes';

const description = 'SQL Server without pulling your teeth out - tips tricks and guides for developers working with Microsoft SQL Server.';
const name = 'SQL at the Dentist';
const url = 'https://sql-at-the-dentist.netlify.app/';
const image = '/logo.jpeg';

export default {
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',
    publicRuntimeConfig: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
    },

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: name,
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: description },

            // Facebook / LinkedIn
            { hid: 'og:url', name: 'og:url', content: url },

            { hid: 'og:title', name: 'og:title', content: name },
            { hid: 'og:description', name: 'og:title', content: description },
            { hid: 'og:type', name: 'og:type', content: 'website' },

            { hid: 'og:image', name: 'og:image', content: process.env.BASE_URL + image },
            { hid: 'og:image:type', name: 'og:image:type', content: 'image/jpeg' },
            { hid: 'og:image:width', name: 'og:image:width', content: '2000' },
            { hid: 'og:image:height', name: 'og:image:height', content: '2000' },

            { hid: 'og:locale', name: 'og:locale', content: 'en_GB' },

            // Twitter
            { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
            { hid: 'twitter:title', name: 'twitter:title', content: name },
            { hid: 'twitter:description', name: 'twitter:description', content: description },
            { hid: 'twitter:image', name: 'twitter:image', content: process.env.BASE_URL + image },
            { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: name },

            // MS Application Favicon
            { hid: 'msapplication-TileColor', name: 'msapplication-TileColor', content: '#00aba9' },
            { hid: 'theme-color', name: 'theme-color', content: '#ffffff' }
        ],
        link: [
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
            { rel: 'manifest', href: '/site.webmanifest' },
            { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/scss/site.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        '@nuxtjs/google-fonts'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
    // https://go.nuxtjs.dev/bootstrap
        'bootstrap-vue/nuxt',
        // https://go.nuxtjs.dev/content
        '@nuxt/content',
        // https://sitemap.nuxtjs.org/
        '@nuxtjs/sitemap',
        // https://github.com/nuxt-community/robots-module#readme
        '@nuxtjs/robots'
    ],

    // Content module configuration: https://go.nuxtjs.dev/config-content
    content: {
        markdown: {
            remarkPlugins: [
                ['remark-autolink-headings', {
                    behavior: 'append',
                    content: {
                        type: 'element',
                        tagName: 'b-icon-link45deg',
                        properties: { variant: ['code-keyword'] }
                    }
                }]
            ]
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    eslint: {
        fix: true
    },

    bootstrapVue: {
        bootstrapCSS: false,
        bootstrapVueCSS: false,
        icons: false,
        components: ['BIcon', 'BIconLink45deg']
    },

    googleFonts: {
        families: {
            Prata: true,
            'Open Sans': [400]
        },
        display: 'fallback',
        useStylesheet: true
    },

    sitemap: {
        hostname: process.env.BASE_URL,
        routes() {
            return getRoutes();
        }
    },

    robots: {
        Sitemap: process.env.BASE_URL + '/sitemap.xml'
    }
};
