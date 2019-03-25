import { Expect, Test, TestCase, TestFixture } from 'alsatian';
import { ArrayProcessor } from './array';

class TestableArrayProcessor<T> extends ArrayProcessor<T> {
    // @ts-ignore: Allow unused parameter
    protected processor(data: T): T {
        throw new Error('Method not implemented.');
    }
}

// tslint:disable-next-line:max-classes-per-file
@TestFixture('ArrayProcessor')
export class ComplexProcessorTests {
    @Test('constructor(): should be created')
    public construct1<T>() {
        const arrayProcessor = new TestableArrayProcessor<T>();

        Expect(arrayProcessor).toBeDefined();
        Expect(arrayProcessor instanceof TestableArrayProcessor).toBe(true);
    }

    @TestCase([])
    @Test('constructor(data): should be created')
    public construct2<T>(data: T[]) {
        const arrayProcessor = new TestableArrayProcessor<T>(data);

        Expect(arrayProcessor).toBeDefined();
        Expect(arrayProcessor instanceof TestableArrayProcessor).toBe(true);
    }

    @TestCase([])
    @Test('constructor(active): should be created')
    public construct3<T>(active: boolean) {
        const arrayProcessor = new TestableArrayProcessor<T>(active);

        Expect(arrayProcessor).toBeDefined();
        Expect(arrayProcessor instanceof TestableArrayProcessor).toBe(true);
    }

    @TestCase([])
    @Test('constructor(data, active): should be created')
    public construct4<T>(data: T[], active: boolean) {
        const arrayProcessor = new TestableArrayProcessor<T>(data, active);

        Expect(arrayProcessor).toBeDefined();
        Expect(arrayProcessor instanceof TestableArrayProcessor).toBe(true);
    }
}
