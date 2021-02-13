import { ComplexProcessor } from './complex-processor';
import type { ComplexProcessorApi } from './complex-processor';

/**
 * The public API of an ArrayProcessor.
 */
export interface ArrayProcessorApi<TEntry> extends ComplexProcessorApi<TEntry[]> {

    /**
     * The number of entries after processing.
     */
    readonly length: number;
}

/**
 * A processor that can be activated and deactived.
 *
 * Designed for complex proessing of arrays.
 */
export abstract class ArrayProcessor<TEntry> extends ComplexProcessor<TEntry[]> {
    /**
     * The number of entries after processing.
     */
    public get length(): number {
        return this.value.length;
    }

    /**
     * Creates a new ArrayProcessor.
     *
     * @param active Whether the ArrayProcessor should start active.
     */
    public constructor(active: boolean = true) {
        super([], [], active);
    }
}
