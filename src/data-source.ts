import { Processor, QueueProcessor } from './processors';
import { BehaviourSubject } from './rxjs';
import { clone } from './utils';

/**
 * A class to handle temporal changes in data while not mutating the original data itself.
 */
export class DataSource<TData> extends BehaviourSubject<TData> {
    protected preprocessors = new QueueProcessor<TData>(this.data);
    protected processors = new QueueProcessor<TData>(this.data);
    protected queue = new QueueProcessor<TData>(this.data, [this.preprocessors, this.processors]);

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

    protected process() {
        const clonedData = clone(this.data);
        const processedData = this.queue.process(clonedData);

        return processedData;
    }
}
