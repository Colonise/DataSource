import { CachedProcessor } from './cached-processor';

/**
 * TODO
 */
export type VoidSorter = void;

/**
 * TODO
 */
export type PropertySorter<TEntry> = keyof TEntry;

/**
 * TODO
 */
export type CustomSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => 1 | 0 | -1;

/**
 * TODO
 */
export type MultiSorter<TEntry> = (CustomSorter<TEntry> | PropertySorter<TEntry>)[];

/**
 * TODO
 */
export type Sorter<TEntry> = VoidSorter | PropertySorter<TEntry> | CustomSorter<TEntry> | MultiSorter<TEntry>;

/**
 * TODO
 */
export class SorterProcessor<TEntry> extends CachedProcessor<TEntry[]> {
    protected cache: TEntry[] = [];

    protected inputSorter?: Sorter<TEntry>;
    protected currentSorter: CustomSorter<TEntry> = this.createVoidSorter();

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
            this.currentSorter = this.createVoidSorter();

            return;
        }

        if (typeof sorter === 'function') {
            this.currentSorter = sorter;

            return;
        }

        if (typeof sorter === 'string') {
            this.currentSorter = this.createPropertySorter(sorter);

            return;
        }

        // MultiSorter support

        const sorters = (<MultiSorter<TEntry>>sorter).map(sorterOrProperty => {
            return typeof sorterOrProperty === 'function'
                ? sorterOrProperty
                : this.createPropertySorter(sorterOrProperty);
        });

        this.currentSorter = (entryA, entryB) => {
            for (let i = 0; i < sorters.length; i++) {
                const sorterResult = sorters[i](entryA, entryB);

                if (sorterResult) {
                    return sorterResult;
                }
            }

            return 0;
        };
    }

    protected processor(array: TEntry[]) {
        return array.sort(this.currentSorter);
    }

    protected createVoidSorter(): CustomSorter<TEntry> {
        return (entryA, entryB) => {
            return entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
        };
    }

    protected createPropertySorter(property: keyof TEntry): CustomSorter<TEntry> {
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
}
