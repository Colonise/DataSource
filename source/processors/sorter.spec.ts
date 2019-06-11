import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { BooleanSorter, FunctionSorter, MultiSorter, PropertySorter, Sorter, SorterProcessor } from './sorter';

@TestFixture('SorterProcessor')
export class SorterProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const sorterProcessor = new SorterProcessor<T>();

        Expect(sorterProcessor).toBeDefined();
        Expect(sorterProcessor instanceof SorterProcessor).toBe(true);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'], true)
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5], true)
    @TestCase(['a', 'e', 'b', 'd', 'c'], ['e', 'd', 'c', 'b', 'a'], false)
    @TestCase([1, 2, 3, 4, 5], [5, 4, 3, 2, 1], false)
    @Test('BooleanSorter should work')
    public BooleanSorter1<T>(data: T[], expected: T[], processor: BooleanSorter) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.process(data);
        sorterProcessor.sorter = processor;

        const actual = sorterProcessor.value;

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
    @Test('PropertySorter should work')
    public PropertySorter1<T>(data: T[], expected: T[], sorter: PropertySorter<T>) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.process(data);
        sorterProcessor.sorter = sorter;

        const actual = sorterProcessor.value;

        Expect(actual).toEqual(expected);
    }

    @TestCase(
        ['a', 'e', 'b', 'd', 'c'],
        ['a', 'b', 'c', 'd', 'e'],
        (a: string, b: string) => (a === b ? 0 : a > b ? 1 : -1)
    )
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5], (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1))
    @Test('FunctionSorter should work')
    public FunctionSorter1<T>(data: T[], expected: T[], sorter: FunctionSorter<T>) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.process(data);
        sorterProcessor.sorter = sorter;
        const sorterSpy = SpyOn(sorterProcessor, 'sorter');

        const actual = sorterProcessor.value;

        sorterSpy.restore();

        Expect(sorterProcessor.sorter).toBe(sorter);
        Expect(sorterSpy).toHaveBeenCalledWith(Any, Any);
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
    @TestCase(
        [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
        [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }],
        ['a', <T extends { a: number; b: number }>(a: T, b: T) => (a.b === b.b ? 0 : a.b > b.b ? 1 : -1)]
    )
    @TestCase(
        [{ a: 2, b: 3 }, { a: 2, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }],
        [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }, { a: 2, b: 3 }],
        [<T extends { a: number; b: number }>(a: T, b: T) => (a.a === b.a ? 0 : a.a > b.a ? 1 : -1), 'b']
    )
    @Test('MultiSorter should work')
    public MultiSorter1<T>(data: T[], expected: T[], sorter: MultiSorter<T>) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.process(data);
        sorterProcessor.sorter = sorter;

        const actual = sorterProcessor.value;

        Expect(actual).toEqual(expected);
    }

    @TestCase([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], true)
    @Test('setting the direction should reprocess the data in the supplied direction')
    public direction1<T>(data: T[], expected: T[], sorter: Sorter<T>) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.process(data);
        sorterProcessor.sorter = sorter;

        const actual = sorterProcessor.value;
        sorterProcessor.direction = false;
        const actualDescending = sorterProcessor.value;
        sorterProcessor.direction = true;
        const actualAscending = sorterProcessor.value;

        Expect(actual).toEqual(expected);
        Expect(actualDescending).toEqual(expected.slice().reverse());
        Expect(actualAscending).toEqual(expected);
    }
}
