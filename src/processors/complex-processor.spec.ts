import { Expect, SpyOn, Test, TestCase, TestFixture } from 'alsatian';
import { ComplexProcessor } from './complex-processor';
import { SimpleProcessor } from './simple-processor';

class TestableComplexProcessor<T> extends ComplexProcessor<T> {
    protected processor(data: T): T {
        throw new Error('Method not implemented.');
    }
}

// tslint:disable-next-line:max-classes-per-file
@TestFixture('ComplexProcessor')
export class ComplexProcessorTests {
    @Test('should be created')
    public construct1<T>() {
        const complexProcessor = new TestableComplexProcessor<T>();

        Expect(complexProcessor).toBeDefined();
        Expect(complexProcessor instanceof TestableComplexProcessor).toBe(true);
    }

    @TestCase([1, 2, 3], [], <T>(data: T[]) => data.slice(data.length))
    @TestCase({ a: 1, b: 2, c: 3 }, {}, <T>(data: T) => {
        Object.keys(data).forEach(key => delete data[<keyof T>key]);
        return data;
    })
    @Test('should only process when active')
    public active1<T>(data: T, processed: T, processor: SimpleProcessor<T>) {
        const complexProcessor = new TestableComplexProcessor<T>();
        // tslint:disable-next-line:no-string-literal
        complexProcessor['processor'] = processor;

        const processorSpy = SpyOn(complexProcessor, 'processor');

        const actualActive = complexProcessor.process(data);
        complexProcessor.active = false;
        const actualNotActive = complexProcessor.process(data);

        Expect(actualActive).toEqual(processed);
        Expect(actualNotActive).toBe(data);
        Expect(processorSpy).toHaveBeenCalledWith(data);
        Expect(processorSpy)
            .toHaveBeenCalled()
            .exactly(1);
    }
}
