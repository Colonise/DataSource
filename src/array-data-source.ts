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
     * Filters the data by whether the entry is truthy
     *
     * Essentially:
     * (entry) => !!entry
     */
    public filter(): TEntry[];
    /**
     * Filters the data by passing each entry to the supplied filter
     *
     * @param filter The function to filter the data by
     */
    public filter(filter: ArrayDataSourceFilter<TEntry>): TEntry[];
    /**
     * Filters the data by whether the supplied property of each entry is truthy
     *
     * Essentially:
     * (entry) => !!entry[property]
     *
     * @param property The property to filter the data by
     */
    public filter<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Filters the data by strict equality of the supplied property of each entry to the supplied value
     *
     * Essentially:
     * (entry) => entry[property] === value
     *
     * @param property The property to filter the data by
     * @param value The value to filter the data by
     */
    public filter<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(property: TKey, value: TValue): TEntry[];
    public filter<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(
        filterOrProperty?: ArrayDataSourceFilter<TEntry> | TKey,
        value?: TValue
    ): TEntry[] {
        let filter: ArrayDataSourceFilter<TEntry>;

        if (filterOrProperty == null) {
            filter = entry => !!entry;
        } else if (typeof filterOrProperty === 'function') {
            filter = filterOrProperty;
        } else if (arguments.length === 1) {
            filter = entry => !!entry[filterOrProperty];
        } else {
            filter = entry => entry[filterOrProperty] === value;
        }

        this.filterProcessor = (entry: TEntry[]) => entry.filter(filter);

        return this.addProcessor(this.filterProcessor);
    }

    /**
     * Removes the data filter if it exists
     */
    public removeFilter() {
        return this.filterProcessor ? this.removeProcessor(this.filterProcessor) : this.processedData;
    }

    /**
     * Sorts the data by comparing each entry
     *
     * Essentially:
     * (entryA, entryB) => entryA === entryB ? 0 : entryA > entryB ? 1 : -1;
     */
    public sort(): TEntry[];
    /**
     * Sorts the data using the supplied sorter to compare each entry
     *
     * @param sorter The function to sort the data by
     */
    public sort(sorter: ArrayDataSourceSorter<TEntry>): TEntry[];
    /**
     * Sorts the data by comparing the property of each entry
     *
     * Essentially:
     * (entryA, entryB) => entryA[property] === entryB[property] ? 0 : entryA[property] > entryB[property] ? 1 : -1;
     *
     * @param property The property to sort the data by
     */
    public sort<TKey extends keyof TEntry>(property: TKey): TEntry[];
    public sort<TKey extends keyof TEntry>(sorterOrProperty?: ArrayDataSourceSorter<TEntry> | TKey): TEntry[] {
        let sorter: ArrayDataSourceSorter<TEntry>;

        if (sorterOrProperty == null) {
            sorter = (entryA, entryB) => {
                if (entryA === entryB) {
                    return 0;
                } else if (entryA > entryB) {
                    return 1;
                } else {
                    return -1;
                }
            };
        } else if (typeof sorterOrProperty === 'function') {
            sorter = sorterOrProperty;
        } else {
            sorter = (entryA, entryB) => {
                if (entryA == null && entryB == null) {
                    return 0;
                } else if (entryA == null) {
                    return -1;
                } else if (entryB == null) {
                    return 1;
                } else if (entryA[sorterOrProperty] === entryB[sorterOrProperty]) {
                    return 0;
                } else if (entryA[sorterOrProperty] > entryB[sorterOrProperty]) {
                    return 1;
                } else {
                    return -1;
                }
            };
        }

        this.sortProcessor = (data: TEntry[]) => data.sort(sorter);

        return this.addProcessor(this.sortProcessor);
    }

    /**
     * Removes the data sort if it exists
     */
    public removeSort() {
        return this.sortProcessor ? this.removeProcessor(this.sortProcessor) : this.processedData;
    }
}
