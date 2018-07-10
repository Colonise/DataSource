import { Expect, IgnoreTest, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayDataSource } from './array-data-source';

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
        const dataSource = new ArrayDataSource(data);

        Expect(dataSource).toBeDefined();
        Expect(dataSource instanceof ArrayDataSource).toBe(true);
    }

    @IgnoreTest('TODO')
    @Test('filter() should add a filter to the processors')
    public filter1<T>(data: T[]) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('filterBy() should add a filter to the processors')
    public filterBy1<T>(data: T[]) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('removeFilter() should remove a filter from the processors')
    public removeFilter1<T>(data: T[]) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('sort() should add a sorter to the processors')
    public sort1<T>(data: T[]) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('sortBy() should add a sorter to the processors')
    public sortBy1<T>(data: T[]) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('removeSort() should remove a sorter from the processors')
    public removeSort1<T>(data: T[]) {
        /**/
    }
}
