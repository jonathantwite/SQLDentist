import mockPage from '@/test/testHelpers/mockPage';
import { processContentArticle } from '~/code/content/contentHelpers';

describe('processContentArticle', () => {
    test('adds createdAtDisplay property', () => {
        const page = mockPage();
        page.createdAt = '2021-15-07';

        processContentArticle(page);
        expect(page.createdAtDisplay).toBeDefined();
    });

    test('adds correct area property', () => {
        const page = mockPage();
        page.path = '/path/to-the-article/';

        processContentArticle(page);
        expect(page.area).toBe('path');
    });
});
