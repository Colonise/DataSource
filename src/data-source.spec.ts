import { Expect, Test, TestCase, TestFixture } from 'alsatian';
import { DataSource } from './data-source';

@TestFixture('DataSource')
export class DataSourceTests {
    @TestCase('')
    @TestCase(0)
    @TestCase(true)
    @TestCase(null)
    @TestCase(undefined)
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
    @Test('should be created')
    public set1<T>(data1: T, data2: T) {
        const dataSource = new DataSource(data1);
        const get1 = dataSource.get();
        dataSource.set(data2);
        const get2 = dataSource.get();

        Expect(data1).not.toBe(data2); // Validate Test Case

        Expect(get1).toEqual(data1);
        Expect(get2).toEqual(data2);
    }
}
