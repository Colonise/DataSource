import { Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { CachedProcessor } from './cached-processor';
import { SimpleProcessor } from './simple-processor';

class TestableCachedProcessor<T> extends CachedProcessor<T> {
    protected cache!: T;

    protected processor(data: T): T {
        throw new Error('Method not implemented.');
    }
}

// tslint:disable-next-line:max-classes-per-file
@TestFixture('CachedProcessor')
export class CachedProcessorTests {
    @Test('should be created')
    public construct1<T>(cache: T) {
        const cachedProcessor = new TestableCachedProcessor<T>();

        Expect(cachedProcessor).toBeDefined();
        Expect(cachedProcessor instanceof TestableCachedProcessor).toBe(true);
    }

    @TestCase([1, 2, 3], [], <T>(data: T[]) => data.slice(data.length))
    @TestCase({ a: 1, b: 2, c: 3 }, {}, <T>(data: T) => {
        Object.keys(data).forEach(key => delete data[<keyof T>key]);
        return data;
    })
    @Test('should only process when not fresh')
    public active1<T>(data: T, processed: T, processor: SimpleProcessor<T>) {
        const cachedProcessor = new TestableCachedProcessor<T>();
        // tslint:disable-next-line:no-string-literal
        cachedProcessor['processor'] = processor;

        const processorSpy = SpyOn(cachedProcessor, 'processor');

        const actualNotFresh = cachedProcessor.process(data);
        const actualFresh = cachedProcessor.process(data);

        Expect(actualFresh).toEqual(processed);
        Expect(actualNotFresh).toEqual(processed);
        Expect(actualFresh).toBe(actualNotFresh);
        Expect(processorSpy).toHaveBeenCalledWith(data);
        Expect(processorSpy)
            .toHaveBeenCalled()
            .exactly(1);
    }
}
