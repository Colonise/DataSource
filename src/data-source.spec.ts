import { createFunctionSpy, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { DataSource } from './data-source';
import { Processor } from './processors';

@TestFixture('DataSource')
export class DataSourceTests {
    @TestCase('')
    @TestCase(0)
    @TestCase(true)
    @TestCase(null)
    @TestCase(undefined)
    @TestCase(() => null)
    @TestCase({})
    @TestCase([])
    @Test('should be created')
    public construct1<T>(data: T) {
        const dataSource = new DataSource(data);

        Expect(dataSource).toBeDefined();
        Expect(dataSource instanceof DataSource).toBe(true);
    }

    @TestCase({})
    @TestCase([])
    @Test('value should return a single clone')
    public get1<T>(data: T) {
        const dataSource = new DataSource(data);
        const get1 = dataSource.value;
        const get2 = dataSource.value;

        Expect(get1).toEqual(data);
        Expect(get1).not.toBe(data);
        Expect(get1).toEqual(get2);
        Expect(get1).toBe(get2);
    }

    @TestCase({}, {})
    @TestCase([], [])
    @Test('set() should set the data')
    public set1<T>(data1: T, data2: T) {
        const dataSource = new DataSource(data1);
        const get1 = dataSource.value;
        dataSource.set(data2);
        const get2 = dataSource.value;

        Expect(get1).toEqual(data1);
        Expect(get2).toEqual(data2);
    }

    @TestCase({ a: 1 }, { a: 1, b: 2 }, (data: any) => {
        data.b = 2;

        return data;
    })
    @TestCase([1], [1, 2], (data: any) => {
        data.push(2);

        return data;
    })
    @Test('addProcessor() should add a processor')
    public addProcessor1<T>(data: T, expected: T, processor: Processor<any>) {
        const dataSource = new DataSource(data);
        const spyable = { processor };
        const processorSpy = SpyOn(spyable, 'processor');

        const get1 = dataSource.value;
        const addProcessorResult = dataSource.addProcessor(spyable.processor);
        const get2 = dataSource.value;

        Expect(get1).not.toBe(addProcessorResult);
        Expect(get1).not.toBe(get2);
        Expect(get1).not.toEqual(expected);
        Expect(get1).not.toEqual(addProcessorResult);
        Expect(get1).not.toEqual(get2);
        Expect(addProcessorResult).toBe(get2);
        Expect(get2).toEqual(expected);
        Expect(processorSpy).not.toHaveBeenCalledWith(get1);
        Expect(processorSpy)
            .toHaveBeenCalled()
            .exactly(1);
    }

    @TestCase({ a: 1 }, (data: any) => {
        data.b = 2;

        return data;
    })
    @TestCase([1], (data: any) => {
        data.push(2);

        return data;
    })
    @Test('removeProcessor() should remove a processor')
    public removeProcessor1<T>(data: T, processor: Processor<any>) {
        const dataSource = new DataSource(data);
        const spyable = { processor };
        const spy = SpyOn(spyable, 'processor');

        const get1 = dataSource.value;
        const addProcessorResult = dataSource.addProcessor(spyable.processor);
        const get2 = dataSource.value;
        const removeProcessorResult = dataSource.removeProcessor(spyable.processor);
        const get3 = dataSource.value;

        Expect(get1).not.toEqual(addProcessorResult);
        Expect(get1).not.toEqual(get2);
        Expect(get1).toEqual(removeProcessorResult);
        Expect(get1).toEqual(get3);
        Expect(get2).not.toEqual(removeProcessorResult);
        Expect(get2).not.toEqual(get3);
        Expect(addProcessorResult).toBe(get2);
        Expect(removeProcessorResult).toBe(get3);
        // Expect(spy).toHaveBeenCalledWith(Any(Object).thatMatches(<object><any>get1));
        // Expect(spy).not.toHaveBeenCalledWith(get2);
        Expect(spy).not.toHaveBeenCalledWith(get3);
        Expect(spy)
            .toHaveBeenCalled()
            .exactly(1);
    }

    @TestCase(1, 2)
    @TestCase(null, undefined)
    @TestCase(true, false)
    @TestCase('a', 'b')
    @TestCase({}, {})
    @TestCase([], [])
    @Test('subscribe() should add an observer so it will be called with data changes')
    public subscribe1<T>(data1: T, data2: T) {
        const dataSource = new DataSource(data1);
        const observerSpy = createFunctionSpy();
        const subscription = dataSource.subscribe(observerSpy);

        dataSource.set(data2);

        Expect(subscription).toBeDefined();
        Expect(observerSpy)
            .toHaveBeenCalled()
            .exactly(2);
    }

    @TestCase(1, 2)
    @TestCase(null, undefined)
    @TestCase(true, false)
    @TestCase('a', 'b')
    @TestCase({}, {})
    @TestCase([], [])
    @Test('unsubscribe() should remove an observer so it will not be called with data changes')
    public unsubscribe1<T>(data1: T, data2: T) {
        const dataSource = new DataSource(data1);
        const observerSpy = createFunctionSpy();
        const subscription = dataSource.subscribe(observerSpy);
        const unsubscribeSpy = SpyOn(dataSource, 'unsubscribe');

        const get1 = dataSource.value;
        dataSource.unsubscribe(subscription);
        dataSource.set(data2);

        Expect(subscription).toBeDefined();
        Expect(observerSpy)
            .toHaveBeenCalledWith(get1)
            .exactly(1);
        Expect(observerSpy)
            .toHaveBeenCalled()
            .exactly(1);
        Expect(unsubscribeSpy)
            .toHaveBeenCalledWith(subscription)
            .exactly(1);
    }

    @TestCase(
        { a: 1, b: 2 },
        { key1: 'a', key2: 'b' },

        <T>(data: T) => {
            const newData: any = {};

            Object.keys(data).forEach(key => (newData[data[<keyof T>key]] = key));

            return newData;
        },
        <T>(data: T) => {
            const newData: any = {};

            Object.keys(data).forEach(key => (newData[`key${key}`] = data[<keyof T>key]));

            return newData;
        }
    )
    @Test('process() should correctly process the data with preprocessors, then processors')
    public process1<T>(data: T, expected: T, preprocessor: Processor<T>, processor: Processor<T>) {
        const dataSource = new DataSource(data);

        const get1 = dataSource.value;
        // tslint:disable-next-line:no-string-literal
        const addPreprocessorResult = dataSource['preprocessors'].addProcessor(preprocessor);
        const get2 = dataSource.value;
        const addProcessorResult = dataSource.addProcessor(processor);
        const get3 = dataSource.value;

        Expect(get1).toEqual(data);
        Expect(addPreprocessorResult).toBe(get2);
        Expect(get1).not.toEqual(get2);
        Expect(addProcessorResult).toBe(get3);
        Expect(get2).not.toEqual(get3);
        Expect(get3).toEqual(expected);
    }
}
