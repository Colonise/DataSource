import { Expect, IgnoreTest, Test, TestCase, TestFixture } from 'alsatian';
import { FilterProcessor, PagerProcessor, SorterProcessor } from './processors';
import { TableDataSource } from './table-data-source';

@TestFixture('TableDataSource')
export class TableDataSourceTests {
    @TestCase([''])
    @TestCase([0])
    @TestCase([true])
    @TestCase([null])
    @TestCase([undefined])
    @TestCase([() => null])
    @TestCase([{}])
    @TestCase([[]])
    @Test('should be created')
    public construct1<T>(array: T[]) {
        const tableDataSource = new TableDataSource(array);

        Expect(tableDataSource).toBeDefined();
        Expect(tableDataSource instanceof TableDataSource).toBe(true);
    }

    @IgnoreTest('TODO')
    @Test('should use supplied filter')
    public filter1<T>(array: T[], filterProcessor: FilterProcessor<T>) {
        const tableDataSource = new TableDataSource(array);
        tableDataSource.filter = filterProcessor;
    }

    @IgnoreTest('TODO')
    @Test('should use supplied sorter')
    public sorter1<T>(array: T[], sorterProcessor: SorterProcessor<T>) {
        const tableDataSource = new TableDataSource(array);
        tableDataSource.sorter = sorterProcessor;
    }

    @IgnoreTest('TODO')
    @Test('should use supplied pager')
    public pager1<T>(array: T[], pagerProcessor: PagerProcessor<T>) {
        const tableDataSource = new TableDataSource(array);
        tableDataSource.pager = pagerProcessor;
    }
}
