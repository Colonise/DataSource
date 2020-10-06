import { ArrayProcessor } from './array';
import type { ArrayProcessorApi } from './array';
import {
    isBoolean, isFunction, isVoid
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
     *
     * Ascending = true;
     *
     * Descending = false;
     */
    direction: boolean;

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

/**
 * An array processor to automatically sort an array using the supplied sorter.
 */
export class SorterProcessor<TEntry> extends ArrayProcessor<TEntry> implements SorterProcessorApi<TEntry> {
    protected inputSorter?: Sorter<TEntry> = undefined;

    protected currentSorter?: FunctionSorter<TEntry> = undefined;

    protected currentDirection = true;

    /**
     * Sets the sorting direction.
     *
     * Ascending = true;
     *
     * Descending = false;
     */
    public get direction(): boolean {
        return this.currentDirection;
    }
    public set direction(ascending: boolean) {
        if (this.currentDirection !== ascending) {
            this.currentDirection = ascending;

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

        if (isVoid(sorter)) {
            this.currentSorter = sorter;
        }
        else if (isBoolean(sorter)) {
            this.currentSorter = this.sorterToDirectionalSorter(this.booleanSorterToFunctionSorter(sorter));
        }
        else if (Array.isArray(sorter)) {
            this.currentSorter = this.sorterToDirectionalSorter(this.multiSorterToFunctionSorter(sorter));
        }
        else {
            this.currentSorter = this.sorterToDirectionalSorter(this.singleSorterToFunctionSorter(sorter));
        }

        this.reprocess();
    }

    /**
     * Creates a new SorterProcessor.
     *
     * @param active Whether the SorterProcessor should start active.
     */
    public constructor(active: boolean = true) {
        super(active);
    }

    protected processor(array: TEntry[]): TEntry[] {
        return this.currentSorter ? array.sort(this.currentSorter) : array;
    }

    protected booleanSorterToFunctionSorter(ascending: boolean): FunctionSorter<TEntry> {
        this.direction = ascending;

        return (entryA, entryB) => this.compare(entryA, entryB);
    }

    protected propertySorterToFunctionSorter(property: PropertySorter<TEntry>): FunctionSorter<TEntry> {
        return (entryA: TEntry, entryB: TEntry) => {
            if (entryA === undefined || entryA === null || entryB === undefined || entryB === null) {
                return this.compareNullOrUndefined(entryA, entryB);
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

            return this.direction ? comparerWrapperResult : -comparerWrapperResult;
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

    // eslint-disable-next-line @typescript-eslint/ban-types
    private compareNullOrUndefined(entryA: TEntry | null | undefined, entryB: TEntry | null | undefined): number {
        if ((entryA === undefined || entryA === null) && (entryB !== undefined && entryB !== null)) {
            return 1;
        }

        if ((entryA !== undefined && entryA !== null) && (entryB === undefined || entryB === null)) {
            return -1;
        }

        return 0;
    }
}
