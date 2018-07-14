import { DataSource, DataSourceProcessor } from './data-source';

export type ArrayDataSourceFilter<TEntry> = (value: TEntry, index: number, array: TEntry[]) => boolean;
export type ArrayDataSourceSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => 1 | 0 | -1;

/**
 * A class to handle temporal changes in an array while not mutating the array itself.
 */
export class ArrayDataSource<TEntry> extends DataSource<TEntry[]> {
    protected filterProcessor?: DataSourceProcessor<TEntry[]>;
    protected sortProcessor?: DataSourceProcessor<TEntry[]>;

    /**
     * Creates a new ArrayDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TEntry[]) {
        super(array);
    }

    /**
     * Filters the array by checking whether the entry is truthy.
     */
    public filter(): TEntry[];
    /**
     * Filters the array by passing each entry to the supplied filter.
     *
     * @param filter The function to filter the array by
     */
    public filter(filter: ArrayDataSourceFilter<TEntry>): TEntry[];
    /**
     * Filters the array by checking whether the supplied property of each entry is truthy.
     *
     * @param property The property to filter the array by
     */
    public filter<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Filters the array by comparing the supplied property of each entry
     * to the supplied value, using strict equality.
     *
     * @param property The property to filter the array by.
     * @param value The value to filter the array by.
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
     * Removes the array filter
     */
    public removeFilter() {
        return this.filterProcessor ? this.removeProcessor(this.filterProcessor) : this.processedData;
    }

    /**
     * Sorts the array by comparing each entry using strict equality.
     */
    public sort(): TEntry[];
    /**
     * Sorts the array using the supplied sorter to compare each entry.
     *
     * @param sorter The function to sort the array by
     */
    public sort(sorter: ArrayDataSourceSorter<TEntry>): TEntry[];
    /**
     * Sorts the array using the supplied sorters to compare each entry.
     *
     * @param sorter The function to sort the array by
     */
    public sort(...sorters: ArrayDataSourceSorter<TEntry>[]): TEntry[];
    /**
     * Sorts the array by comparing the property of each entry using strict equality.
     *
     * @param property The property to sort the array by
     */
    public sort<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Sorts the array by comparing the properties of each entry.
     *
     * @param property The property to sort the array by
     */
    public sort<TKey extends keyof TEntry>(...properties: TKey[]): TEntry[];
    /**
     * Sorts the array using the supplied sorters and by comparing the supplied
     * properties of each entry, using strict equality.
     *
     * @param property The property to sort the array by
     */
    public sort<TKey extends keyof TEntry>(...sortersAndProperties: (ArrayDataSourceSorter<TEntry> | TKey)[]): TEntry[];
    public sort<TKey extends keyof TEntry>(): TEntry[] {
        const sortersAndProperties: TypedArguments<ArrayDataSourceSorter<TEntry> | TKey> = arguments;
        const sorters: ArrayDataSourceSorter<TEntry>[] = [];

        if (sortersAndProperties.length === 0) {
            sorters.push((entryA, entryB) => {
                if (entryA === entryB) {
                    return 0;
                } else if (entryA > entryB) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            for (let i = 0; i < sortersAndProperties.length; i++) {
                const sorterOrProperty = sortersAndProperties[i];

                if (typeof sorterOrProperty === 'function') {
                    sorters.push(sorterOrProperty);
                } else {
                    sorters.push((entryA, entryB) => {
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
                    });
                }
            }
        }

        const sorter: ArrayDataSourceSorter<TEntry> = (entryA, entryB) => {
            for (let i = 0; i < sorters.length; i++) {
                const sorterResult = sorters[i](entryA, entryB);

                if (sorterResult) {
                    return sorterResult;
                }
            }

            return 0;
        };

        this.sortProcessor = (array: TEntry[]) => array.sort(sorter);

        return this.addProcessor(this.sortProcessor);
    }

    /**
     * Removes the array sorter.
     */
    public removeSort() {
        return this.sortProcessor ? this.removeProcessor(this.sortProcessor) : this.processedData;
    }
}
