import { fieldsForListing } from '@/components/ArticleListing';

export default (mockPage) => {
    const page = {};
    fieldsForListing.forEach((f) => { page[f] = undefined; });
    return page;
};
