import ArticleListings from './ArticleListing.vue';

export default {
    component: { ArticleListings },
    title: 'Components/ArticleListing',
    argsTypes:  { 'articles': [
        {
            'title': 'Article 1',
            'description': 'The first article',
            'createdAtDisplay': '7 Jan 2021',
            'slug': 'blog/1',
            'path': '/blog/1'
        }
    ]}
};

const Template = (args, { argsTypes }) => ({
    components: { ArticleListings },
    props: Object.keys(argsTypes),
    template: '<article-listings :articles="articles"/>'
});

export const NuxtWebsite = Template.bind({});
