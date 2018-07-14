import { Expect, IgnoreTest, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayDataSource } from './array-data-source';
import { FilterProcessor, PagerProcessor, SorterProcessor } from './processors';

@TestFixture('ArrayDataSource')
export class ArrayDataSourceTests {
    @TestCase([''])
    @TestCase([0])
    @TestCase([true])
    @TestCase([null])
    @TestCase([undefined])
    @TestCase([() => null])
    @TestCase([{}])
    @TestCase([[]])
    @Test('should be created')
    public construct1<T>(data: T[]) {
        const arrayDataSource = new ArrayDataSource(data);

        Expect(arrayDataSource).toBeDefined();
        Expect(arrayDataSource instanceof ArrayDataSource).toBe(true);
    }

    @IgnoreTest('TODO')
    @Test('should use supplied filter')
    public filter1<T>(data: T[], filterProcessor: FilterProcessor<T>) {
        const arrayDataSource = new ArrayDataSource(data);
        arrayDataSource.filter = filterProcessor;
    }

    @IgnoreTest('TODO')
    @Test('should use supplied sorter')
    public sorter1<T>(data: T[], sorterProcessor: SorterProcessor<T>) {
        const arrayDataSource = new ArrayDataSource(data);
        arrayDataSource.sorter = sorterProcessor;
    }

    @IgnoreTest('TODO')
    @Test('should use supplied pager')
    public pager1<T>(data: T[], pagerProcessor: PagerProcessor<T>) {
        const arrayDataSource = new ArrayDataSource(data);
        arrayDataSource.pager = pagerProcessor;
    }
}
