import { expect } from 'chai';
import { SorterDirection } from './sorter-direction';
import { SorterProcessor } from './sorter-processor';

describe('SorterProcessor Tests', () => {
    it('should be created', () => {
        const sorterProcessor = new SorterProcessor<unknown>();

        expect(sorterProcessor).to.exist;
        expect(sorterProcessor instanceof SorterProcessor).to.be.true;
    });

    it('BooleanSorter should work', () => {
        const testCases = [
            {
                data: ['a', 'e', 'b', 'd', 'c'],
                processor: true,
                expected: ['a', 'b', 'c', 'd', 'e']
            },
            {
                data: [5, 4, 3, 2, 1],
                processor: true,
                expected: [1, 2, 3, 4, 5]
            },
            {
                data: ['a', 'e', 'b', 'd', 'c'],
                processor: false,
                expected: ['e', 'd', 'c', 'b', 'a']
            },
            {
                data: [1, 2, 3, 4, 5],
                processor: false,
                expected: [5, 4, 3, 2, 1]
            }
        ];

        for (const { data, processor, expected } of testCases) {
            const sorterProcessor = new SorterProcessor<unknown>();
            sorterProcessor.process(data);
            sorterProcessor.sorter = processor;

            const actual = sorterProcessor.value;

            expect(actual).to.eql(expected);
        }
    });

    it('PropertySorter should work', () => {
        const testCases = [
            {
                data: [{ a: 4 }, { a: 2 }, { a: 3 }, { a: 1 }, { a: 5 }],
                processor: <keyof { a: number }>'a',
                expected: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
            },
            {
                data: [{ a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }],
                processor: <keyof { a: number }>'a',
                expected: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
            }
        ];

        for (const { data, processor, expected } of testCases) {
            const sorterProcessor = new SorterProcessor<{ a: number }>();
            sorterProcessor.process(data);
            sorterProcessor.sorter = processor;

            const actual = sorterProcessor.value;

            expect(actual).to.eql(expected);
        }
    });

    it('FunctionSorter should work', () => {
        const testCases = [
            {
                data: ['a', 'e', 'b', 'd', 'c'],
                processor: (a: string, b: string) => (a === b ? 0 : a > b ? 1 : -1),
                expected: ['a', 'b', 'c', 'd', 'e']
            }
        ];

        for (const { data, processor, expected } of testCases) {
            const sorterProcessor = new SorterProcessor<string>();
            sorterProcessor.process(data);
            sorterProcessor.sorter = processor;

            const actual = sorterProcessor.value;

            expect(actual).to.eql(expected);
        }
    });

    it('MultiSorter should work', () => {
        const testCases = [
            {
                data: [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
                processor: [
                    <T extends { a: number; b: number }>(a: T, b: T) => (a.a === b.a ? 0 : a.a > b.a ? 1 : -1),
                    <T extends { a: number; b: number }>(a: T, b: T) => (a.b === b.b ? 0 : a.b > b.b ? 1 : -1)
                ],
                expected: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }]
            },
            {
                data: [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
                processor: [<keyof { a: number, b: number }>'a', <keyof { a: number, b: number }>'b'],
                expected: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }]
            },
            {
                data: [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
                processor: [<keyof { a: number, b: number }>'a', <T extends { a: number; b: number }>(a: T, b: T) => (a.b === b.b ? 0 : a.b > b.b ? 1 : -1)],
                expected: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }]
            },
            {
                data: [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
                processor: [<T extends { a: number; b: number }>(a: T, b: T) => (a.a === b.a ? 0 : a.a > b.a ? 1 : -1), <keyof { a: number, b: number }>'b'],
                expected: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }]
            }
        ];

        for (const { data, processor, expected } of testCases) {
            const sorterProcessor = new SorterProcessor<{ a: number, b: number }>();
            sorterProcessor.process(data);
            sorterProcessor.sorter = processor;

            const actual = sorterProcessor.value;

            expect(actual).to.eql(expected);
        }
    });

    it('setting the direction should reprocess the data in the supplied direction', () => {
        const testCases = [
            {
                data: [1, 2, 3, 4, 5],
                sorter: true,
                expected: [1, 2, 3, 4, 5]
            }
        ];

        for (const { data, sorter, expected } of testCases) {
            const sorterProcessor = new SorterProcessor<number>();
            sorterProcessor.process(data);
            sorterProcessor.sorter = sorter;

            const actual = sorterProcessor.value;
            sorterProcessor.direction = SorterDirection.Descending;
            const actualDescending = sorterProcessor.value;
            sorterProcessor.direction = SorterDirection.Ascending;
            const actualAscending = sorterProcessor.value;

            expect(actual).to.eql(expected);
            expect(actualDescending).to.eql(expected.slice().reverse());
            expect(actualAscending).to.eql(expected);
        }
    });
});
