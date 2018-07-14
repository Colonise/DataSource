import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayDataSource } from './array-data-source';
import { ArrayDataSourceFilter, ArrayDataSourcePager, ArrayDataSourceSorter } from './processors';

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

    @TestCase([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5])
    @TestCase([0, '', undefined, null, false], [])
    @Test('setFilter() should add a filter to the processors')
    public setFilter1<T>(data: T[], expected: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setFilter();

        Expect(actual).toEqual(expected);
    }

    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], (data: { a: 1 | 0 }) => !data.a)
    @TestCase([1, 2, 3, 4, 5], [1, 3, 5], (data: number) => data % 2 !== 0)
    @TestCase([0, '', undefined, null, false], [], (data: any) => !!data)
    @Test('setFilter(filter) should add a filter to the processors')
    public setFilter2<T>(data: T[], expected: T[], filter: ArrayDataSourceFilter<T>) {
        const dataSource = new ArrayDataSource(data);
        const spyable = { filter };
        const filterSpy = SpyOn(spyable, 'filter');

        const actual = dataSource.setFilter(spyable.filter);

        Expect(filterSpy)
            .toHaveBeenCalledWith(Any, Any(Number), Any(Array))
            .exactly(data.length);
        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[1], [2], [3]], 'length')
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 1 }, { a: 1 }, { a: 1 }], 'a')
    @Test('setFilter(property) should add a filter to the processors')
    public setFilter3<T>(data: T[], expected: T[], property: keyof T) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setFilter(property);

        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[], []], 'length', 0)
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], 'a', 0)
    @Test('setFilter(property, value) should add a filter to the processors')
    public setFilter4<T>(data: T[], expected: T[], property: keyof T, value: T[keyof T]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setFilter(property, value);

        Expect(actual).toEqual(expected);
    }

    @TestCase([0, '', undefined, null, false])
    @TestCase([0, 1, 2, 3, 4, 5])
    @Test('removeFilter() should remove a filter from the processors')
    public removeFilter1<T>(data: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual1 = dataSource.setFilter(entry => !!entry);
        const actual2 = dataSource.removeFilter();

        Expect(actual1).not.toEqual(data);
        Expect(actual2).toEqual(data);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])
    @Test('setSorter() should add a sorter to the processors')
    public setSorter1<T>(data: T[], expected: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setSorter();

        Expect(actual).toEqual(expected);
    }

    @TestCase(
        ['a', 'e', 'b', 'd', 'c'],
        ['a', 'b', 'c', 'd', 'e'],
        (a: string, b: string) => (a === b ? 0 : a > b ? 1 : -1)
    )
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5], (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1))
    @Test('setSorter(sorter) should add a sorter to the processors')
    public setSorter2<T>(data: T[], expected: T[], sorter: ArrayDataSourceSorter<T>) {
        const dataSource = new ArrayDataSource(data);
        const spyable = { sorter };
        const sorterSpy = SpyOn(spyable, 'sorter');

        const actual = dataSource.setSorter(spyable.sorter);

        Expect(sorterSpy)
            .toHaveBeenCalledWith(Any, Any)
            .greaterThan(data.length);
        Expect(actual).toEqual(expected);
    }

    @TestCase(
        [{ a: 4 }, { a: 2 }, { a: 3 }, { a: 1 }, { a: 5 }],
        [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
        'a'
    )
    @TestCase(
        [{ a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }],
        [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
        'a'
    )
    @Test('setSorter(property) should add a sorter to the processors')
    public setSorter3<T>(data: T[], expected: T[], property: keyof T) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setSorter(property);

        Expect(actual).toEqual(expected);
    }

    @TestCase(
        [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
        [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }],
        [
            <T extends { a: number; b: number }>(a: T, b: T) => (a.a === b.a ? 0 : a.a > b.a ? 1 : -1),
            <T extends { a: number; b: number }>(a: T, b: T) => (a.b === b.b ? 0 : a.b > b.b ? 1 : -1)
        ]
    )
    @TestCase(
        [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
        [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }],
        ['a', 'b']
    )
    @Test('setSorter(...sortersAndProperties) should add a sorter to the processors')
    public setSorter4<T>(data: T[], expected: T[], sortersAndProperties: (ArrayDataSourceSorter<T> | keyof T)[]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setSorter(...sortersAndProperties);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])
    @Test('removeSort() should remove a sorter from the processors')
    public removeSorter1<T>(data: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual1 = dataSource.setSorter((a, b) => (a === b ? 0 : a > b ? 1 : -1));
        const actual2 = dataSource.removeSorter();

        Expect(actual1).not.toEqual(data);
        Expect(actual2).toEqual(data);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 2, 3], 1, 3)
    @TestCase([1, 2, 3, 4, 5], [4, 5], 2, 3)
    @TestCase([1, 2, 3, 4, 5], [], 3, 3)
    @Test('setPager(page, pageSize) should add a pager to the processors')
    public setPager1<T>(data: T[], expected: T[], page: number, pageSize: number) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.setPager(page, pageSize);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'])
    @TestCase([5, 4, 3, 2, 1])
    @Test('removePager() should remove a sorter from the processors')
    public removePager1<T>(data: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual1 = dataSource.setPager(1, 5);
        const actual2 = dataSource.removePager();

        Expect(actual1).not.toEqual(data);
        Expect(actual2).toEqual(data);
    }
}
