import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { PagerProcessor } from './pager';

@TestFixture('PagerProcessor')
export class PagerProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const pagerProcessor = new PagerProcessor<T>();

        Expect(pagerProcessor).toBeDefined();
        Expect(pagerProcessor instanceof PagerProcessor).toBe(true);
    }

    @TestCase([1, 2, 3, 4, 5, 6, 7], [1, 2, 3], 1, 3)
    @TestCase([1, 2, 3, 4, 5, 6, 7], [4, 5, 6], 2, 3)
    @TestCase([1, 2, 3, 4, 5, 6, 7], [7], 3, 3)
    @TestCase([1, 2, 3, 4, 5, 6, 7], [], 4, 3)
    @TestCase([1, 2, 3, 4, 5, 6, 7], [1, 2], 1, 2)
    @TestCase([1, 2, 3, 4, 5, 6, 7], [1], 1, 1)
    @Test('should output correct entries when setting page and page size')
    public page1<T>(data: T[], expected: T[], page: number, pageSize: number) {
        const pagerProcessor = new PagerProcessor<T>();
        pagerProcessor.process(data);
        pagerProcessor.page = page;
        pagerProcessor.pageSize = pageSize;

        const actual = pagerProcessor.value;

        Expect(actual).toEqual(expected);
    }
}
