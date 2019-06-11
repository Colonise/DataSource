import { Any, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { FilterProcessor, FunctionFilter, PropertyAndValueFilter, PropertyFilter } from './filter';

@TestFixture('FilterProcessor')
export class FilterProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const filterProcessor = new FilterProcessor<T>();

        Expect(filterProcessor).toBeDefined();
        Expect(filterProcessor instanceof FilterProcessor).toBe(true);
    }

    @TestCase([0, 1, 2, 3, 4, 5], [1, 2, 3, 4, 5], true)
    @TestCase([0, '', undefined, null, false], [], true)
    @TestCase([0, 1, 2, 3, 4, 5], [0], false)
    @TestCase([0, '', undefined, null, false], [0, '', undefined, null, false], false)
    @Test('BooleanFilter should work')
    public BooleanFilter1<T>(data: T[], expected: T[], filter: boolean) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.process(data);
        filterProcessor.filter = filter;

        const actual = filterProcessor.value;

        Expect(filterProcessor.filter).toBe(filter);
        Expect(actual).toEqual(expected);
    }

    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], (data: { a: 1 | 0 }) => !data.a)
    @TestCase([1, 2, 3, 4, 5], [1, 3, 5], (data: number) => data % 2 !== 0)
    @TestCase([0, '', undefined, null, false], [], (data: unknown) => !!data)
    @Test('FunctionFilter should work')
    public FunctionFilter1<T>(data: T[], expected: T[], filter: FunctionFilter<T>) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.process(data);
        filterProcessor.filter = filter;

        const filterSpy = SpyOn(filterProcessor, 'filter');

        const actual = filterProcessor.value;

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
        filterProcessor.process(data);
        filterProcessor.filter = filter;

        const actual = filterProcessor.value;

        Expect(filterProcessor.filter).toBe(filter);
        Expect(actual).toEqual(expected);
    }

    @TestCase([[], [1], [2], [3], []], [[], []], { property: 'length', value: 0 })
    @TestCase([{ a: 1 }, { a: 0 }, { a: 1 }, { a: 0 }, { a: 1 }], [{ a: 0 }, { a: 0 }], { property: 'a', value: 0 })
    @Test('PropertyAndValueFilter should work')
    public PropertyAndValueFilter1<T>(data: T[], expected: T[], filter: PropertyAndValueFilter<T>) {
        const filterProcessor = new FilterProcessor<T>();
        filterProcessor.process(data);
        filterProcessor.filter = filter;

        const actual = filterProcessor.value;

        Expect(filterProcessor.filter).toBe(filter);
        Expect(actual).toEqual(expected);
    }
}
