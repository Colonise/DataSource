import { ComplexProcessor, Processor } from '../processors';
import { QueueProcessor } from '../processors';

/**
 * A class to handle temporal changes in data while not mutating the original data itself.
 */
export class DataSource<TData> extends ComplexProcessor<TData> {
    protected preprocessors = new QueueProcessor<TData>(this.lastInput, this.lastOutput);
    protected processors = new QueueProcessor<TData>(this.lastInput, this.lastOutput);
    protected queue = new QueueProcessor<TData>(this.lastInput, this.lastOutput, [
        this.preprocessors,
        this.processors
    ]);

    /**
     * Creates a new DataSource with the supplied data.
     *
     * @param data The data.
     */
    public constructor (lastInput: TData, lastOutput: TData) {
        super(lastInput, lastOutput);

        this.queue.subscribe(newData => this.next(newData));
    }

    /**
     * Sets the data.
     *
     * @param data The new data to replace the current data with.
     */
    public set(data: TData): TData {
        this.lastInput = data;

        return this.process(this.lastInput);
    }

    /**
     * Appends the supplied processor to manipulate the data before it is output.
     *
     * @param processor The data processor to add.
     */
    public addProcessor(processor: Processor<TData>): TData {
        if (this.processors.length === 0) {
            this.processors.process(this.preprocessors.value);
        }

        return this.processors.addProcessor(processor);
    }

    /**
     * Removes the supplied processor from manipulating the data output.
     *
     * @param processor The data processor to remove.
     */
    public removeProcessor(processor: Processor<TData>): TData {
        return this.processors.removeProcessor(processor);
    }

    protected processor(data: TData): TData {
        return this.queue.process(data);
    }
}
