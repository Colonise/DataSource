import { createFunctionSpy, Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { DataSource } from './data-source';
import { Processor } from './processors/processor';

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
    @Test('get() should return a single clone')
    public get1<T>(data: T) {
        const dataSource = new DataSource(data);
        const get1 = dataSource.get();
        const get2 = dataSource.get();

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
        const get1 = dataSource.get();
        dataSource.set(data2);
        const get2 = dataSource.get();

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
        const spy = SpyOn(spyable, 'processor');
        const get1 = dataSource.get();
        dataSource.addProcessor(spyable.processor);
        const get2 = dataSource.get();

        Expect(get1).not.toEqual(expected);
        Expect(get1).not.toEqual(get2);
        Expect(get2).toEqual(expected);
        Expect(spy).not.toHaveBeenCalledWith(get1);
        Expect(spy).toHaveBeenCalledWith(get2);
        Expect(spy)
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

        const get1 = dataSource.get();
        dataSource.addProcessor(spyable.processor);
        const get2 = dataSource.get();
        dataSource.removeProcessor(spyable.processor);
        const get3 = dataSource.get();

        Expect(spy).not.toHaveBeenCalledWith(get1);
        Expect(spy).toHaveBeenCalledWith(get2);
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

        const get1 = dataSource.get();
        dataSource.set(data2);
        const get2 = dataSource.get();

        Expect(subscription).toBeDefined();
        Expect(observerSpy)
            .toHaveBeenCalledWith(get1)
            .exactly(1);
        Expect(observerSpy)
            .toHaveBeenCalledWith(get2)
            .exactly(1);
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

        const get1 = dataSource.get();
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
    @Test('processData() should correctly process the data with preprocessors, then processors')
    public processData1<T>(
        data: T,
        expected: T,
        preprocessor: Processor<T>,
        processor: Processor<T>
    ) {
        const dataSource = new DataSource(data);

        const get1 = dataSource.get();
        // tslint:disable-next-line:no-string-literal
        dataSource['preprocessors'] = [preprocessor];
        const get2 = dataSource.get();
        dataSource.addProcessor(processor);
        const get3 = dataSource.get();

        Expect(get1).toBe(get2);
        Expect(get3).toEqual(expected);
    }
}
