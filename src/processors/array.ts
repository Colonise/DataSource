import { isArray } from '@colonise/utilities';
import { ComplexProcessor, ComplexProcessorApi } from './complex';

/**
 * The public API of an ArrayProcessor.
 */
export interface ArrayProcessorApi<TEntry>
    extends ComplexProcessorApi<TEntry[]> {
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
export abstract class ArrayProcessor<TEntry> extends ComplexProcessor<
    TEntry[]
    > {
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
    public constructor();
    public constructor(data: TEntry[]);
    public constructor(active: boolean);
    public constructor(data: TEntry[], active: boolean);
    public constructor(...args: [] | [TEntry[]] | [boolean] | [TEntry[], boolean]) {
        if (args.length === 0) {
            super([]);
        } else if (args.length === 1) {
            if (isArray(args[0])) {
                super(args[0]);
            } else {
                super([], args[0]);
            }
        } else {
            super(args[0], args[1]);
        }
    }
}
