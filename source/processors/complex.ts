import { BehaviourSubject } from '../rxjs';
import type { BehaviourSubjectApi } from '../rxjs';
import { clone } from '@colonise/utilities';

/**
 * The public API of a ComplexProcessor.
 */
export interface ComplexProcessorApi<TData> extends BehaviourSubjectApi<TData> {

    /**
     * Whether this processor is active.
     *
     * An inactive processor returns the data it is supplied.
     */
    active: boolean;
}

/**
 * A processor that can be activated and deactived.
 *
 * Designed for complex proessing.
 */
export abstract class ComplexProcessor<TData> extends BehaviourSubject<TData> implements ComplexProcessorApi<TData> {
    protected processing = false;

    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    protected currentLastInput = clone(this.lastOutput);
    protected get lastInput(): TData {
        return clone(this.currentLastInput);
    }
    protected set lastInput(data: TData) {
        this.currentLastInput = data;
    }

    protected isActive = true;

    /**
     * Whether this processor is active.
     *
     * An inactive processor returns the data it is supplied.
     */
    public get active(): boolean {
        return this.isActive;
    }
    public set active(active: boolean) {
        this.isActive = active;

        this.reprocess(active);
    }

    public constructor(value: TData, active: boolean = true) {
        super(value);

        this.isActive = active;
    }

    /**
     * Processes some data.
     *
     * @param data The data to process.
     * @param force Whether to force the processor to run, ignoring the active and fresh statuses.
     */
    public process(data: TData, force: boolean = false): TData {
        this.lastInput = data;

        if (!this.shouldProcess(force)) {
            return data;
        }

        const processedData = this.processor(data);

        return this.next(processedData);
    }

    /**
     * Reprocesses the data.
     *
     * @param force Whether to force the ComplexProcessor to reprocess.
     */
    public reprocess(force: boolean = false): TData {
        return this.process(this.lastInput, force);
    }

    protected abstract processor(data: TData): TData;

    protected shouldProcess(force: boolean = false): boolean {
        return !this.processing && (this.active || force);
    }
}
