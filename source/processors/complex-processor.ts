import { Subject } from '../rxjs';
import type { SubjectApi } from '../rxjs';

/**
 * The public API of a ComplexProcessor.
 */
export interface ComplexProcessorApi<TData> extends SubjectApi<TData> {

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
export abstract class ComplexProcessor<TData> extends Subject<TData> implements ComplexProcessorApi<TData> {
    protected _processing: boolean = false;
    protected _active: boolean = true;

    public get processing(): boolean {
        return this._processing;
    }

    /**
     * Whether this processor is active.
     *
     * An inactive processor returns the data it is supplied.
     */
    public get active(): boolean {
        return this._active;
    }
    public set active(active: boolean) {
        this._active = active;

        this.reprocess(active);
    }

    public constructor (lastInput: TData, lastOutput: TData, active: boolean = true) {
        super(lastInput, lastOutput);

        this._active = active;
    }

    protected abstract processor(data: TData): TData;

    /**
     * Processes some data.
     *
     * @param data The data to process.
     * @param force Whether to force the processor to run, ignoring the active and fresh statuses.
     */
    public process(data: TData, force: boolean = false): TData {
        this.lastInput = data;

        if (!this.shouldProcess(force)) {
            return this.lastOutput;
        }
        
        this._processing = true;

        const processedData = this.processor(data);
        
        this._processing = false;

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

    protected shouldProcess(force: boolean = false): boolean {
        return !this._processing && (this.active || force);
    }
}
