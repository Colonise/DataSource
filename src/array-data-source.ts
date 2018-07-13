import { DataSource, DataSourceProcessor } from './data-source';

export type ArrayDataSourceFilter<TEntry> = (value: TEntry, index: number, array: TEntry[]) => boolean;
export type ArrayDataSourceSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => 1 | 0 | -1;

/**
 * TODO
 */
export class ArrayDataSource<TEntry> extends DataSource<TEntry[]> {
    protected filterProcessor?: DataSourceProcessor<TEntry[]>;
    protected sortProcessor?: DataSourceProcessor<TEntry[]>;

    /**
     * TODO
     *
     * @param data TODO
     */
    public constructor(data: TEntry[]) {
        super(data);
    }

    /**
     * Filters the data by passing each entry to the supplied filter
     *
     * @param filter The function to filter the data by
     */
    public filter(filter: ArrayDataSourceFilter<TEntry>): TEntry[] {
        this.removeFilter();

        this.filterProcessor = (entry: TEntry[]) => entry.filter(filter);

        return this.addProcessor(this.filterProcessor);
    }

    /**
     * Filters the data by whether the entry is truthy
     *
     * Essentially:
     * (entry) => !!entry
     */
    public filterBy(): TEntry[];
    /**
     * Filters the data by whether the supplied property of each entry is truthy
     *
     * Essentially:
     * (entry) => !!entry[property]
     *
     * @param property The property to filter the data by
     */
    public filterBy<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Filters the data by strict equality of the supplied property of each entry to the supplied value
     *
     * Essentially:
     * (entry) => entry[property] === value
     *
     * @param property The property to filter the data by
     * @param value The value to filter the data by
     */
    public filterBy<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(property: TKey, value: TValue): TEntry[];
    public filterBy<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(property?: TKey, value?: TValue): TEntry[] {
        if (property == null) {
            return this.filter(entry => !!entry);
        } else if (arguments.length === 1) {
            return this.filter(entry => !!entry[property]);
        } else {
            return this.filter(entry => entry[property] === value);
        }
    }

    /**
     * Removes the data filter if it exists
     */
    public removeFilter() {
        return this.filterProcessor ? this.removeProcessor(this.filterProcessor) : this.processedData;
    }

    /**
     * Sorts the data using the supplied sorter to compare each entry
     *
     * @param sorter The function to sort the data by
     */
    public sort(sorter: ArrayDataSourceSorter<TEntry>): TEntry[] {
        if (this.sortProcessor) {
            this.removeProcessor(this.sortProcessor);
        }

        this.sortProcessor = (data: TEntry[]) => data.sort(sorter);

        return this.addProcessor(this.sortProcessor);
    }

    /**
     * Sorts the data by comparing each entry
     *
     * Essentially:
     * (entryA, entryB) => entryA === entryB ? 0 : entryA > entryB ? 1 : -1;
     */
    public sortBy(): TEntry[];
    /**
     * Sorts the data by comparing the property of each entry
     *
     * Essentially:
     * (entryA, entryB) => entryA[property] === entryB[property] ? 0 : entryA[property] > entryB[property] ? 1 : -1;
     *
     * @param property The property to sort the data by
     */
    public sortBy<TKey extends keyof TEntry>(property: TKey): TEntry[];
    public sortBy<TKey extends keyof TEntry>(property?: TKey): TEntry[] {
        if (property == null) {
            return this.sort((entryA, entryB) => {
                if (entryA === entryB) {
                    return 0;
                } else if (entryA > entryB) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            return this.sort((entryA, entryB) => {
                if (entryA == null && entryB == null) {
                    return 0;
                } else if (entryA == null) {
                    return -1;
                } else if (entryB == null) {
                    return 1;
                } else if (entryA[property] === entryB[property]) {
                    return 0;
                } else if (entryA[property] > entryB[property]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
    }

    /**
     * Removes the data sort if it exists
     */
    public removeSort() {
        return this.sortProcessor ? this.removeProcessor(this.sortProcessor) : this.processedData;
    }
}
