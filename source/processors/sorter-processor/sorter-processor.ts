import { ArrayProcessor } from '../array-processor';
import type { ArrayProcessorApi } from '../array-processor';
import { SorterDirection } from './sorter-direction';
import {
    compareNullOrUndefined,
    compareNumbers,
    isBoolean,
    isFunction,
    isVoid
} from '@colonise/utilities';

/**
 * Sorts an array using truthiness and strict equality.
 */
export type BooleanSorter = boolean;

/**
 * Sorts an array by a property using truthiness and strict equality.
 */
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type PropertySorter<TEntry> = keyof TEntry;

/**
 * Sorts an array.
 */
export type FunctionSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => number;

/**
 * Union type of FunctionSorter<TEntry> | PropertySorter<TEntry>
 */
export type SingleSorter<TEntry> = FunctionSorter<TEntry> | PropertySorter<TEntry>;

/**
 * Sorts an array by multiple sorters in order.
 */
export type MultiSorter<TEntry> = SingleSorter<TEntry>[];

/**
 * Union Type of VoidSorter | SingleSorter<TEntry> | MultiSorter<TEntry>
 */
export type Sorter<TEntry> = BooleanSorter | SingleSorter<TEntry> | MultiSorter<TEntry>;

/**
 * The public API of a SorterProcessor.
 */
export interface SorterProcessorApi<TEntry> extends ArrayProcessorApi<TEntry> {

    /**
     * Sets the sorting direction.
     */
    direction: SorterDirection;

    /**
     * Sorts the array.
     *
     * Setting as a boolean sets the direction.
     *
     * Boolean: (entryA, entryB) => entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
     * String:  (entryA, entryB) => entryA[sorter] < entryB[sorter] ? -1 : entryA[sorter] > entryB[sorter] ? 1 : 0;
     */
    sorter?: Sorter<TEntry>;
}

export interface SorterProcessorOptions<TEntry> {
    sorter?: Sorter<TEntry>;
    direction?: SorterDirection;
    active?: boolean;
}

/**
 * An array processor to automatically sort an array using the supplied sorter.
 */
export class SorterProcessor<TEntry> extends ArrayProcessor<TEntry> implements SorterProcessorApi<TEntry> {
    protected inputSorter: Sorter<TEntry> | undefined;

    protected currentSorter: FunctionSorter<TEntry> | undefined;

    protected currentDirection: SorterDirection = SorterDirection.Ascending;

    /**
     * Sets the sorting direction.
     */
    public get direction(): SorterDirection {
        return this.currentDirection;
    }

    public set direction(direction: SorterDirection) {
        if (this.currentDirection !== direction) {
            this.currentDirection = direction;

            this.reprocess();
        }
    }

    /**
     * Sorts the array.
     *
     * Setting as a boolean sets the direction.
     *
     * Boolean: (entryA, entryB) => entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
     * String:  (entryA, entryB) => entryA[sorter] < entryB[sorter] ? -1 : entryA[sorter] > entryB[sorter] ? 1 : 0;
     */
    public get sorter(): Sorter<TEntry> | undefined {
        return this.inputSorter;
    }

    public set sorter(sorter: Sorter<TEntry> | undefined) {
        this.inputSorter = sorter;

        this.currentSorter = this.convertSorterToFunctionSorter(sorter);

        this.reprocess();
    }

    /**
     * Creates a new SorterProcessor.
     *
     * @param sorter The sorter that will sort the array.
     * @param direction Sets the sorting direction.
     * @param active Whether the SorterProcessor should start active.
     */
    public constructor(options?: SorterProcessorOptions<TEntry>) {
        super(options?.active ?? true);

        const sorter = options?.sorter ?? undefined;

        this.inputSorter = sorter;
        this.currentSorter = this.convertSorterToFunctionSorter(sorter);
        this.currentDirection = options?.direction ?? SorterDirection.Ascending;
    }

    protected processor(array: TEntry[]): TEntry[] {
        if (this.currentSorter) {
            const currentSorter = this.currentSorter;

            return array
                .map((item, index) => ({
                    value: item,
                    index
                }))
                .sort((entryA, entryB) => {
                    const result = currentSorter(entryA.value, entryB.value);

                    if (result === 0) {
                        return compareNumbers(entryA.index, entryB.index);
                    }

                    return result;
                })
                .map(entry => entry.value);
        }

        return array;
    }

    protected booleanSorterToFunctionSorter(ascending: boolean): FunctionSorter<TEntry> {
        this.direction = ascending ? SorterDirection.Ascending : SorterDirection.Descending;

        return (entryA, entryB) => this.compare(entryA, entryB);
    }

    protected propertySorterToFunctionSorter(property: PropertySorter<TEntry>): FunctionSorter<TEntry> {
        return (entryA: TEntry, entryB: TEntry) => {
            if (entryA === undefined || entryA === null || entryB === undefined || entryB === null) {
                return compareNullOrUndefined(entryA, entryB);
            }

            return this.compare(entryA[property], entryB[property]);
        };
    }

    protected singleSorterToFunctionSorter(sorter: SingleSorter<TEntry>): FunctionSorter<TEntry> {
        if (isFunction(sorter)) {
            return sorter;
        }

        if (isBoolean(sorter)) {
            return this.booleanSorterToFunctionSorter(sorter);
        }

        return this.propertySorterToFunctionSorter(sorter);
    }

    protected multiSorterToFunctionSorter(sorters: MultiSorter<TEntry>): FunctionSorter<TEntry> {
        const customSorters = sorters.map(sorter => this.singleSorterToFunctionSorter(sorter));

        return (entryA, entryB) => {
            for (const customSorter of customSorters) {
                const sorterResult = customSorter(entryA, entryB);

                if (sorterResult !== 0) {
                    return sorterResult;
                }
            }

            return 0;
        };
    }

    protected sorterToDirectionalSorter(sorter: FunctionSorter<TEntry>): FunctionSorter<TEntry> {
        return (entryA, entryB) => {
            const comparerWrapperResult = sorter(entryA, entryB);

            return this.direction === SorterDirection.Ascending ? comparerWrapperResult : -comparerWrapperResult;
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private compare(valueA: any, valueB: any): number {
        if (valueA < valueB) {
            return -1;
        }

        if (valueA > valueB) {
            return 1;
        }

        return 0;
    }

    private convertSorterToFunctionSorter(sorter: Sorter<TEntry> | undefined): FunctionSorter<TEntry> | undefined {
        if (isVoid(sorter)) {
            return sorter;
        }

        if (isBoolean(sorter)) {
            return this.sorterToDirectionalSorter(this.booleanSorterToFunctionSorter(sorter));
        }

        if (Array.isArray(sorter)) {
            return this.sorterToDirectionalSorter(this.multiSorterToFunctionSorter(sorter));
        }

        return this.sorterToDirectionalSorter(this.singleSorterToFunctionSorter(sorter));
    }
}
