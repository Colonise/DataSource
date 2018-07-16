import { ComplexProcessor } from './complex';

/**
 * Sorts an array using truthiness and strict equality.
 */
export type VoidSorter = void;

/**
 * Sorts an array by a property using truthiness and strict equality.
 */
export type PropertySorter<TEntry> = keyof TEntry;

/**
 * Sorts an array.
 */
export type FunctionSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => 1 | 0 | -1;

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
export type Sorter<TEntry> = VoidSorter | SingleSorter<TEntry> | MultiSorter<TEntry>;

/**
 * An array processor to automatically sort an array using the supplied sorter.
 */
export class SorterProcessor<TEntry> extends ComplexProcessor<TEntry[]> {
    protected inputSorter?: Sorter<TEntry>;

    protected currentSorter: FunctionSorter<TEntry> = this.voidSorterToFunctionSorter();

    constructor() {
        super([]);
    }

    /**
     * Sorts the array.
     *
     * Void:   (entryA, entryB) => entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
     * String: (entryA, entryB) => entryA[sorter] < entryB[sorter] ? -1 : entryA[sorter] > entryB[sorter] ? 1 : 0;
     */
    public get sorter(): Sorter<TEntry> | undefined {
        return this.inputSorter;
    }
    public set sorter(sorter: Sorter<TEntry> | undefined) {
        this.inputSorter = sorter;

        if (sorter == null) {
            this.currentSorter = this.voidSorterToFunctionSorter();
        } else if (!Array.isArray(sorter)) {
            this.currentSorter = this.singleSorterToFunctionSorter(sorter);
        } else {
            this.currentSorter = this.multiSorterToFunctionSorter(sorter);
        }

        this.reprocess();
    }

    protected processor(array: TEntry[]) {
        return array.sort(this.currentSorter);
    }

    protected voidSorterToFunctionSorter(): FunctionSorter<TEntry> {
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
        return typeof sorter === 'function' ? sorter : this.propertySorterToFunctionSorter(sorter);
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
}
