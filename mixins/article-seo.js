export default {
    head() {
        return {
            title: this.page.title,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.page.description
                },
                {
                    hid: 'og:description',
                    name: 'og:description',
                    content: this.page.description
                },
                {
                    hid: 'twitter:description',
                    name: 'twitter:description',
                    content: this.page.description
                }
            ]
        };
    }
};
