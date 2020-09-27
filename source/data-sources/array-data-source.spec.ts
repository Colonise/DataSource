import { expect } from 'chai';
import { ArrayDataSource } from './array-data-source';

describe('ArrayDataSource Tests', () => {
    it('should be created', () => {
        const testCases = [
            {
                array: []
            }
        ];

        for (const { array } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            expect(arrayDataSource).to.exist;
            expect(arrayDataSource instanceof ArrayDataSource).to.be.true;
        }
    });

    it('.length should return correct length', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4],
                expected: 4
            },
            {
                array: [1, 2, 3, 4, 5],
                expected: 5
            },
            {
                // tslint:disable-next-line:no-sparse-arrays
                array: [1, 2, 3, 4, 5, , 7],
                expected: 7
            }
        ];

        for (const { array, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            expect(arrayDataSource.length).to.equal(expected);
        }
    });

    it('.push() should return correct length', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4, 5],
                entries: [6],
                expected: [1, 2, 3, 4, 5, 6]
            },
            {
                array: [1, 2, 3, 4, 5],
                entries: [6, 7],
                expected: [1, 2, 3, 4, 5, 6, 7]
            }
        ];

        for (const { array, entries, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.push(...entries);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.insert(index: number, entry: TEntry) should insert the entry at the index', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4, 5],
                index: 2,
                entry: 6,
                expected: [1, 2, 6, 3, 4, 5]
            }
        ];

        for (const { array, index, entry, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.insert(index, entry);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.insert(index: number, entries: TEntry[]) should insert the entries at the index', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4, 5],
                index: 2,
                entries: [6, 7],
                expected: [1, 2, 6, 7, 3, 4, 5]
            }
        ];

        for (const { array, index, entries, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.insert(index, entries);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.remove(entry: TEntry) should remove the entry', () => {
        const testCases = [
            {
                array: ['1', '2', '3', '4', '5'],
                entry: '5',
                expected: ['1', '2', '3', '4']
            }
        ];

        for (const { array, entry, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.remove(entry);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.remove(entries: TEntry[]) should remove the entries', () => {
        const testCases = [
            {
                array: ['1', '2', '3', '4', '5'],
                entries: ['1', '5'],
                expected: ['2', '3', '4']
            }
        ];

        for (const { array, entries, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.remove(entries);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.remove(index: number, count?: number) should remove the count of entries from the index', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4, 5],
                index: 1,
                count: 2,
                expected: [1, 4, 5]
            }
        ];

        for (const { array, index, count, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.remove(index, count);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });

    it('.assign() should assign an entry at an index', () => {
        const testCases = [
            {
                array: [1, 2, 3, 4, 5],
                index: 6,
                entry: 6,
                expected: [1, 2, 3, 4, 5, , 6]
            },
            {
                array: [1, 2, 3, 4, 5],
                index: 3,
                entry: 6,
                expected: [1, 2, 3, 6, 5]
            }
        ];

        for (const { array, index, entry, expected } of testCases) {
            const arrayDataSource = new ArrayDataSource(array);

            arrayDataSource.assign(index, entry);

            expect(arrayDataSource.value).to.eql(expected);
        }
    });
});
