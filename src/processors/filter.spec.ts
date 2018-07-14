import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { CustomFilter, FilterProcessor, PropertyAndValueFilter, PropertyFilter } from './filter';

@TestFixture('FilterProcessor')
export class FilterProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const filterProcessor = new FilterProcessor<T>();

        Expect(filterProcessor).toBeDefined();
        Expect(filterProcessor instanceof FilterProcessor).toBe(true);
    }

    @TestCase([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5])
    @TestCase([0, '', undefined, null, false], [])
    @Test('VoidFilter should work')
    public VoidFilter1<T>(data: T[], expected: T[]) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.filter = undefined;

        const actual = filterProcessor.process(data);

        Expect(filterProcessor.filter).toBe(undefined);
        Expect(actual).toEqual(expected);
    }

    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], (data: { a: 1 | 0 }) => !data.a)
    @TestCase([1, 2, 3, 4, 5], [1, 3, 5], (data: number) => data % 2 !== 0)
    @TestCase([0, '', undefined, null, false], [], (data: any) => !!data)
    @Test('CustomFilter should work')
    public CustomFilter1<T>(data: T[], expected: T[], filter: CustomFilter<T>) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.filter = filter;
        const filterSpy = SpyOn(filterProcessor, 'filter');

        const actual = filterProcessor.process(data);

        filterSpy.restore();

        Expect(filterProcessor.filter).toBe(filter);
        Expect(filterSpy)
            .toHaveBeenCalledWith(Any, Any(Number), Any(Array))
            .exactly(data.length);
        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[1], [2], [3]], 'length')
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 1 }, { a: 1 }, { a: 1 }], 'a')
    @Test('PropertyFilter should work')
    public PropertyFilter1<T>(data: T[], expected: T[], filter: PropertyFilter<T>) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.filter = filter;

        const actual = filterProcessor.process(data);

        Expect(filterProcessor.filter).toBe(filter);
        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[], []], { property: 'length', value: 0 })
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], { property: 'a', value: 0 })
    @Test('PropertyAndValueFilter should work')
    public PropertyAndValueFilter1<T>(data: T[], expected: T[], filter: PropertyAndValueFilter<T>) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.filter = filter;

        const actual = filterProcessor.process(data);

        Expect(filterProcessor.filter).toBe(filter);
        Expect(actual).toEqual(expected);
    }
}