import { Expect, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayDataSource } from './array-data-source';

@TestFixture('ArrayDataSource')
export class ArrayDataSourceTests {
    @TestCase('')
    @TestCase(0)
    @TestCase(true)
    @TestCase(null)
    @TestCase(undefined)
    @TestCase(() => null)
    @TestCase({})
    @TestCase([])
    @Test('should be created')
    public construct1<T>(array: T[]) {
        const arrayDataSource = new ArrayDataSource(array);

        Expect(arrayDataSource).toBeDefined();
        Expect(arrayDataSource instanceof ArrayDataSource).toBe(true);
    }

    @TestCase([1, 2, 3, 4], 4)
    @TestCase([1, 2, 3, 4, 5], 5)
    // tslint:disable-next-line:no-sparse-arrays
    @TestCase([1, 2, 3, 4, 5, , 7], 7)
    @Test('.length should return correct length')
    public length1<T>(array: T[], expected: number) {
        const arrayDataSource = new ArrayDataSource(array);

        Expect(arrayDataSource.length).toEqual(expected);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [6])
    @TestCase([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7], [6, 7])
    @Test('.push() should return correct length')
    public push1<T>(array: T[], expected: T[], entries: T[]) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.push(...entries);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 2, 6, 3, 4, 5], 2, 6)
    @Test('.insert(index: number, entry: TEntry) should insert the entry at the index')
    public insert1<T>(array: T[], expected: T[], index: number, entry: T) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.insert(index, entry);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 2, 6, 7, 3, 4, 5], 2, [6, 7])
    @Test('.insert(index: number, entries: TEntry[]) should insert the entries at the index')
    public insert2<T>(array: T[], expected: T[], index: number, entries: T[]) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.insert(index, entries);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    @TestCase(['1', '2', '3', '4', '5'], ['1', '2', '3', '4'], '5')
    @Test('.remove(entry: TEntry) should remove the entry')
    public remove1<T>(array: T[], expected: T[], entry: T) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.remove(entry);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    @TestCase(['1', '2', '3', '4', '5'], ['2', '3', '4'], ['1', '5'])
    @Test('.remove(entries: TEntry[]) should remove the entries')
    public remove2<T>(array: T[], expected: T[], entries: T[]) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.remove(entries);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 4, 5], 1, 2)
    @Test('.remove(index: number, count?: number) should remove the count of entries from the index')
    public remove3<T>(array: T[], expected: T[], index: number, count?: number) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.remove(index, count);

        Expect(arrayDataSource.value).toEqual(expected);
    }

    // tslint:disable-next-line:no-sparse-arrays
    @TestCase([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, , 6], 6, 6)
    @TestCase([1, 2, 3, 4, 5], [1, 2, 3, 6, 5], 3, 6)
    @Test('.assign() should assign an entry at an index')
    public assign1<T>(array: T[], expected: T[], index: number, entry: T) {
        const arrayDataSource = new ArrayDataSource(array);

        arrayDataSource.assign(index, entry);

        Expect(arrayDataSource.value).toEqual(expected);
    }
}
