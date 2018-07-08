import { Expect, IgnoreTest, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { DataSource, DataSourceProcessor } from './data-source';
import { PartialObserver } from './rx-subscribable';

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

        Expect(data1).not.toBe(data2); // Validate Test Case

        Expect(get1).toEqual(data1);
        Expect(get2).toEqual(data2);
    }

    @TestCase({ a: 1 }, { a: 1, b: 2 }, (data: any) => (data.b = 2))
    @TestCase([1], [1, 2], (data: any) => data.push(2))
    @Test('addProcessor() should add a processor')
    public addProcessor1<T>(data: T, expected: T, processor: DataSourceProcessor<any>) {
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

    @TestCase({ a: 1 }, (data: any) => (data.b = 2))
    @TestCase([1], (data: any) => data.push(2))
    @Test('removeProcessor() should remove a processor')
    public removeProcessor1<T>(data: T, processor: DataSourceProcessor<any>) {
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

    @IgnoreTest('TODO')
    @Test('subscribe() should add a observer')
    public subscribe1<T>(data: T, observer: PartialObserver<T>) {
        /**/
    }

    @IgnoreTest('TODO')
    @Test('unsubscribe() should remove a observer')
    public unsubscribe1<T>(data: T, observer: PartialObserver<T>) {
        /**/
    }
}
