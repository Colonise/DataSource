import { DataSource } from './data-source';
import {
    ArrayDataSourceFilter,
    ArrayDataSourceFilterProcessor,
    ArrayDataSourcePagerProcessor,
    ArrayDataSourceSorter,
    ArrayDataSourceSorterProcessor,
    DataSourceProcessor
} from './processors';

/**
 * A class to handle temporal changes in an array while not mutating the array itself.
 */
export class ArrayDataSource<TEntry> extends DataSource<TEntry[]> {
    protected filterProcessor: ArrayDataSourceFilterProcessor<TEntry> = {
        processor: array => array.filter(this.filterProcessor.filter),
        filter: () => true,
        active: false
    };

    protected sorterProcessor: ArrayDataSourceSorterProcessor<TEntry> = {
        processor: array => array.sort(this.sorterProcessor.sorter),
        sorter: () => 0,
        active: false
    };

    protected pagerProcessor: ArrayDataSourcePagerProcessor<TEntry> = {
        processor: array => this.pagerProcessor.pager(this.pagerProcessor.page, this.pagerProcessor.pageSize, array),
        pager: (page, pageSize, array) => {
            const start = pageSize * (page - 1);
            const end = start + pageSize;

            return array.slice(start, end);
        },
        active: false,
        page: 1,
        pageSize: 20
    };

    /**
     * Creates a new ArrayDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TEntry[]) {
        super(array);

        this.preprocessors.push(unprocessedArray => {
            let preprocessedArray = unprocessedArray;

            if (this.filterProcessor.active) {
                preprocessedArray = this.filterProcessor.processor(preprocessedArray);
            }

            if (this.sorterProcessor.active) {
                preprocessedArray = this.sorterProcessor.processor(preprocessedArray);
            }

            if (this.pagerProcessor.active) {
                preprocessedArray = this.pagerProcessor.processor(preprocessedArray);
            }

            return preprocessedArray;
        });
    }

    /**
     * Filters the array by checking whether the entry is truthy.
     */
    public setFilter(): TEntry[];
    /**
     * Filters the array by passing each entry to the supplied filter.
     *
     * @param filter The function to filter the array by
     */
    public setFilter(filter: ArrayDataSourceFilter<TEntry>): TEntry[];
    /**
     * Filters the array by checking whether the supplied property of each entry is truthy.
     *
     * @param property The property to filter the array by
     */
    public setFilter<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Filters the array by comparing the supplied property of each entry
     * to the supplied value, using strict equality.
     *
     * @param property The property to filter the array by.
     * @param value The value to filter the array by.
     */
    public setFilter<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(property: TKey, value: TValue): TEntry[];
    public setFilter<TKey extends keyof TEntry, TValue extends TEntry[TKey]>(
        filterOrProperty?: ArrayDataSourceFilter<TEntry> | TKey,
        value?: TValue
    ): TEntry[] {
        if (filterOrProperty == null) {
            this.filterProcessor.filter = entry => !!entry;
        } else if (typeof filterOrProperty === 'function') {
            this.filterProcessor.filter = filterOrProperty;
        } else if (arguments.length === 1) {
            this.filterProcessor.filter = entry => !!entry[filterOrProperty];
        } else {
            this.filterProcessor.filter = entry => entry[filterOrProperty] === value;
        }

        this.filterProcessor.active = true;

        return this.processData();
    }

    /**
     * Removes the array filter
     */
    public removeFilter() {
        this.filterProcessor.active = false;

        return this.processData();
    }

    /**
     * Sorts the array by comparing each entry using strict equality.
     */
    public setSorter(): TEntry[];
    /**
     * Sorts the array using the supplied sorter to compare each entry.
     *
     * @param sorter The function to sort the array by
     */
    public setSorter(sorter: ArrayDataSourceSorter<TEntry>): TEntry[];
    /**
     * Sorts the array using the supplied sorters to compare each entry.
     *
     * @param sorter The function to sort the array by
     */
    public setSorter(...sorters: ArrayDataSourceSorter<TEntry>[]): TEntry[];
    /**
     * Sorts the array by comparing the property of each entry using strict equality.
     *
     * @param property The property to sort the array by
     */
    public setSorter<TKey extends keyof TEntry>(property: TKey): TEntry[];
    /**
     * Sorts the array by comparing the properties of each entry.
     *
     * @param property The property to sort the array by
     */
    public setSorter<TKey extends keyof TEntry>(...properties: TKey[]): TEntry[];
    /**
     * Sorts the array using the supplied sorters and by comparing the supplied
     * properties of each entry, using strict equality.
     *
     * @param property The property to sort the array by
     */
    public setSorter<TKey extends keyof TEntry>(
        ...sortersAndProperties: (ArrayDataSourceSorter<TEntry> | TKey)[]
    ): TEntry[];
    public setSorter<TKey extends keyof TEntry>(): TEntry[] {
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

        this.sorterProcessor.sorter = (entryA, entryB) => {
            for (let i = 0; i < sorters.length; i++) {
                const sorterResult = sorters[i](entryA, entryB);

                if (sorterResult) {
                    return sorterResult;
                }
            }

            return 0;
        };

        this.sorterProcessor.active = true;

        return this.processData();
    }

    /**
     * Removes the array sorter.
     */
    public removeSorter() {
        this.sorterProcessor.active = false;

        return this.processData();
    }

    /**
     * Reduces the processed array to the supplied page size, offset by the supplied page multipled by the page size.
     *
     * @param page The 1-based page number.
     * @param pageSize The number of pages to show per page.
     */
    public setPager(page: number = this.pagerProcessor.page, pageSize: number = this.pagerProcessor.pageSize) {
        this.pagerProcessor.page = page;
        this.pagerProcessor.pageSize = pageSize;

        this.pagerProcessor.active = true;

        return this.processData();
    }

    /**
     * Removes the array pager.
     */
    public removePager() {
        this.pagerProcessor.active = false;

        return this.processData();
    }

    /**
     * Sets the pager's page.
     *
     * @param page The 1-based page number.
     */
    public setPage(page: number) {
        this.pagerProcessor.page = page;

        return this.processData();
    }

    /**
     * Sets the pager's page size.
     *
     * @param pageSize The number of pages to show per page.
     */
    public setPageSize(pageSize: number) {
        this.pagerProcessor.pageSize = pageSize;

        return this.processData();
    }
}
