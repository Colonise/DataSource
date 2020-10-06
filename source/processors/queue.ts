import { ComplexProcessor } from './complex';
import type { Processor } from './processor';
import type { Unsubscribable } from '../rxjs';
import {
    findIndexBy,
    insert,
    removeAt
} from '@colonise/utilities';

export type ProcessorTuple<TData> = [Processor<TData>, Unsubscribable | undefined];

/**
 * A processor that wraps a queue of ComplexProcessors, passing the input data through the queue.
 */
export class QueueProcessor<TData> extends ComplexProcessor<TData> {
    protected processorTuples: ProcessorTuple<TData>[] = [];

    /**
     * The number of processors in the queue.
     */
    public get length(): number {
        return this.processorTuples.length;
    }

    /**
     * Creates a new QueueProcessor.
     *
     * @param value The initial value for subscribers.
     * @param processors The initial processors.
     */
    public constructor(value: TData, processors: Processor<TData>[] = []) {
        super(value);

        processors.forEach(processor => {
            this.addProcessor(processor);
        });
    }

    /**
     * Appends the supplied processor to manipulate the data before it is output.
     *
     * @param processor The data processor to add.
     * @param index The index to insert the processor at.
     */
    public addProcessor(processor: Processor<TData>, index?: number): TData {
        const processorTuple: ProcessorTuple<TData> = [
            processor,
            undefined
        ];

        if (processor instanceof ComplexProcessor) {
            processorTuple[1] = processor.subscribe(() => {
                this.reprocessFromIndex(this.processorTuples.indexOf(processorTuple) + 1);
            });
        }

        if (index === undefined) {
            this.processorTuples.push(processorTuple);

            return this.reprocessFromIndex(this.processorTuples.length - 1);
        }
        insert(this.processorTuples, index, processorTuple);

        return this.reprocessFromIndex(index - 1);
    }

    /**
     * Removes the supplied processor from manipulating the data output.
     *
     * @param processor The data processor to remove.
     */
    public removeProcessor(processor: Processor<TData>): TData {
        const index = findIndexBy(this.processorTuples, processorTuple => processorTuple[0] === processor);

        if (index !== -1) {
            removeAt(this.processorTuples, index);

            return this.reprocessFromIndex(index);
        }

        return this.lastOutput;
    }

    protected runProcessor(data: TData, processor: Processor<TData>): TData {
        if (processor instanceof ComplexProcessor) {
            return processor.process(data);
        }
        return processor(data);
    }

    protected getInputForIndex(index: number): TData {
        for (let i = index; i >= 0; i--) {
            const processorTuple: ProcessorTuple<TData> | undefined = <ProcessorTuple<TData> | undefined>this.processorTuples[i];

            if (processorTuple !== undefined) {
                const [
                    processor
                ] = processorTuple;

                if (processor instanceof ComplexProcessor) {
                    return processor.getValue();
                }
            }
        }

        return this.lastInput;
    }

    protected processor(data: TData): TData {
        this.lastInput = data;
        let processedData = data;

        this.processing = true;

        this.processorTuples.forEach(processorTuple => {
            processedData = this.runProcessor(processedData, processorTuple[0]);
        });

        this.processing = false;

        return processedData;
    }

    protected reprocessFromIndex(index: number, force: boolean = false): TData {
        if (!this.shouldProcess(force)) {
            return this.lastOutput;
        }

        let processedData = this.getInputForIndex(index - 1);

        this.processorTuples.slice(index).forEach(processorTuple => {
            processedData = this.runProcessor(processedData, processorTuple[0]);
        });

        return this.next(processedData);
    }
}
