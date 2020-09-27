import { BehaviourSubject } from '../rxjs';
import { clone } from '@colonise/utilities';
import type { Processor } from '../processors';
import { QueueProcessor } from '../processors';

/**
 * A class to handle temporal changes in data while not mutating the original data itself.
 */
export class DataSource<TData> extends BehaviourSubject<TData> {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    protected preprocessors = new QueueProcessor<TData>(this.data);
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    protected processors = new QueueProcessor<TData>(this.data);
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    protected queue = new QueueProcessor<TData>(this.data, [
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this.preprocessors,
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this.processors
    ]);

    /**
     * Creates a new DataSource with the supplied data.
     *
     * @param data The data.
     * @param preprocessors The preprocessors that have precedence over the processors.
     */
    public constructor(protected data: TData) {
        super(clone(data));

        this.queue.subscribe(newData => this.next(newData));

        this.process();
    }

    /**
     * Sets the data.
     *
     * @param data The new data to replace the current data with.
     */
    public set(data: TData): TData {
        this.data = data;

        return this.process();
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

    protected process(): TData {
        const clonedData = clone(this.data);
        const processedData = this.queue.process(clonedData);

        return processedData;
    }
}
