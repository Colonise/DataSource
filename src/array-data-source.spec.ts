import { Any, Expect, IgnoreTest, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayDataSource, ArrayDataSourceFilter, ArrayDataSourceSorter } from './array-data-source';

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
    @Test('filter() should add a filter to the processors')
    public filter1<T>(data: T[], expected: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.filter();

        Expect(actual).toEqual(expected);
    }

    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], (data: { a: 1 | 0 }) => !data.a)
    @TestCase([1, 2, 3, 4, 5], [1, 3, 5], (data: number) => data % 2 !== 0)
    @TestCase([0, '', undefined, null, false], [], (data: any) => !!data)
    @Test('filter(filter) should add a filter to the processors')
    public filter2<T>(data: T[], expected: T[], filter: ArrayDataSourceFilter<T>) {
        const dataSource = new ArrayDataSource(data);
        const spyable = { filter };
        const filterSpy = SpyOn(spyable, 'filter');

        const actual = dataSource.filter(spyable.filter);

        Expect(filterSpy)
            .toHaveBeenCalledWith(Any, Any(Number), Any(Array))
            .exactly(data.length);
        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[1], [2], [3]], 'length')
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 1 }, { a: 1 }, { a: 1 }], 'a')
    @Test('filterBy(property) should add a filter to the processors')
    public filter3<T>(data: T[], expected: T[], property: keyof T) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.filter(property);

        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[], []], 'length', 0)
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], 'a', 0)
    @Test('filterBy(property, value) should add a filter to the processors')
    public filter4<T>(data: T[], expected: T[], property: keyof T, value: T[keyof T]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.filter(property, value);

        Expect(actual).toEqual(expected);
    }

    @TestCase([0, '', undefined, null, false], [])
    @TestCase([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5])
    @Test('removeFilter() should remove a filter from the processors')
    public removeFilter1<T>(data: T[], expectedFiltered: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual1 = dataSource.filter(entry => !!entry);
        const actual2 = dataSource.removeFilter();

        Expect(actual1).toEqual(expectedFiltered);
        Expect(actual2).toEqual(data);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])
    @Test('sort() should add a sorter to the processors')
    public sort1<T>(data: T[], expected: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.sort();

        Expect(actual).toEqual(expected);
    }

    @TestCase(
        ['a', 'e', 'b', 'd', 'c'],
        ['a', 'b', 'c', 'd', 'e'],
        (a: string, b: string) => (a === b ? 0 : a > b ? 1 : -1)
    )
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5], (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1))
    @Test('sort(sorter) should add a sorter to the processors')
    public sort2<T>(data: T[], expected: T[], sorter: ArrayDataSourceSorter<T>) {
        const dataSource = new ArrayDataSource(data);
        const spyable = { sorter };
        const sorterSpy = SpyOn(spyable, 'sorter');

        const actual = dataSource.sort(spyable.sorter);

        Expect(sorterSpy)
            .toHaveBeenCalledWith(Any, Any)
            .greaterThan(data.length);
        Expect(actual).toEqual(expected);
    }

    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }])
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }])
    @Test('sort(property) should add a sorter to the processors')
    public sort3<T>(data: T[], expected: T[], property: keyof T) {
        const dataSource = new ArrayDataSource(data);

        const actual = dataSource.sort(property);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])
    @Test('removeSort() should remove a sorter from the processors')
    public removeSort1<T>(data: T[], expectedSorted: T[]) {
        const dataSource = new ArrayDataSource(data);

        const actual1 = dataSource.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
        const actual2 = dataSource.removeSort();

        Expect(actual1).toEqual(expectedSorted);
        Expect(actual2).toEqual(data);
    }
}
