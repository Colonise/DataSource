import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { CustomSorter, MultiSorter, PropertySorter, SorterProcessor, VoidSorter } from './sorter';

@TestFixture('SorterProcessor')
export class SorterProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const sorterProcessor = new SorterProcessor<T>();

        Expect(sorterProcessor).toBeDefined();
        Expect(sorterProcessor instanceof SorterProcessor).toBe(true);
    }

    @TestCase(['a', 'e', 'b', 'd', 'c'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5])
    @Test('VoidSorter should work')
    public VoidSorter1<T>(data: T[], expected: T[], processor: VoidSorter) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.sorter = processor;

        const actual = sorterProcessor.process(data);

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
        sorterProcessor.sorter = sorter;

        const actual = sorterProcessor.process(data);

        Expect(actual).toEqual(expected);
    }

    @TestCase(
        ['a', 'e', 'b', 'd', 'c'],
        ['a', 'b', 'c', 'd', 'e'],
        (a: string, b: string) => (a === b ? 0 : a > b ? 1 : -1)
    )
    @TestCase([5, 4, 3, 2, 1], [1, 2, 3, 4, 5], (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1))
    @Test('CustomSorter should work')
    public CustomSorter1<T>(data: T[], expected: T[], sorter: CustomSorter<T>) {
        const sorterProcessor = new SorterProcessor<T>();
        sorterProcessor.sorter = sorter;
        const sorterSpy = SpyOn(sorterProcessor, 'sorter');

        const actual = sorterProcessor.process(data);

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
        sorterProcessor.sorter = sorter;

        const actual = sorterProcessor.process(data);

        Expect(actual).toEqual(expected);
    }
}
