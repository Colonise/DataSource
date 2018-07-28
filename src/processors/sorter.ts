import { isBoolean, isFunction, isVoid } from '../utils';
import { ArrayProcessor, ArrayProcessorApi } from './array';

/**
 * Sorts an array using truthiness and strict equality.
 */
export type BooleanSorter = void;

/**
 * Sorts an array by a property using truthiness and strict equality.
 */
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
export type Sorter<TEntry> = BooleanSorter | SingleSorter<TEntry> | MultiSorter<TEntry> | void;

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
    sorter: Sorter<TEntry>;
}

/**
 * An array processor to automatically sort an array using the supplied sorter.
 */
export class SorterProcessor<TEntry> extends ArrayProcessor<TEntry> implements SorterProcessorApi<TEntry> {
    protected inputSorter: Sorter<TEntry> = undefined;

    protected currentSorter: FunctionSorter<TEntry> | void = undefined;

    // tslint:disable-next-line:variable-name
    protected _direction = true;

    /**
     * Sets the sorting direction.
     *
     * Ascending = true;
     *
     * Descending = false;
     */
    public get direction(): boolean {
        return this._direction;
    }
    public set direction(ascending: boolean) {
        if (this._direction !== ascending) {
            this._direction = ascending;

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
        } else if (!Array.isArray(sorter)) {
            this.currentSorter = this.sorterToDirectionalSorter(this.singleSorterToFunctionSorter(sorter));
        } else {
            this.currentSorter = this.sorterToDirectionalSorter(this.multiSorterToFunctionSorter(sorter));
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

    protected processor(array: TEntry[]) {
        return this.currentSorter ? array.sort(this.currentSorter) : array;
    }

    protected booleanSorterToFunctionSorter(ascending: boolean): FunctionSorter<TEntry> {
        this.direction = ascending;

        return (entryA, entryB) => {
            return entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
        };
    }

    protected propertySorterToFunctionSorter(property: PropertySorter<TEntry>): FunctionSorter<TEntry> {
        return (entryA: TEntry, entryB: TEntry) => {
            if (entryA == null && entryB == null) {
                return 0;
            } else if (entryA == null) {
                return -1;
            } else if (entryB == null) {
                return 1;
            } else if (entryA[property] < entryB[property]) {
                return -1;
            } else if (entryA[property] > entryB[property]) {
                return 1;
            } else {
                return 0;
            }
        };
    }

    protected singleSorterToFunctionSorter(sorter: SingleSorter<TEntry>): FunctionSorter<TEntry> {
        if (isFunction(sorter)) {
            return sorter;
        } else if (isBoolean(sorter)) {
            return this.booleanSorterToFunctionSorter(sorter);
        } else {
            return this.propertySorterToFunctionSorter(sorter);
        }
    }

    protected multiSorterToFunctionSorter(sorters: MultiSorter<TEntry>): FunctionSorter<TEntry> {
        const customSorters = sorters.map(sorter => this.singleSorterToFunctionSorter(sorter));

        return (entryA, entryB) => {
            for (let i = 0; i < customSorters.length; i++) {
                const sorterResult = customSorters[i](entryA, entryB);

                if (sorterResult) {
                    return sorterResult;
                }
            }

            return 0;
        };
    }

    protected sorterToDirectionalSorter(sorter: FunctionSorter<TEntry>): FunctionSorter<TEntry> {
        return (entryA, entryB) => {
            const result = sorter(entryA, entryB);

            return this.direction ? result : result * -1;
        };
    }
}
