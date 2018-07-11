import { DataSource, DataSourceProcessor } from './data-source';

export type ArrayDataSourceFilter<TData> = (value: TData, index: number, array: TData[]) => boolean;
export type ArrayDataSourceSorter<TData> = (data1: TData, data2: TData) => 1 | 0 | -1;

export class ArrayDataSource<TData> extends DataSource<TData[]> {
    protected filterProcessor?: DataSourceProcessor<TData[]>;
    protected sortProcessor?: DataSourceProcessor<TData[]>;

    /**
     * Filters the data by passing each entry to the supplied filter
     *
     * @param filter The function to filter the data by
     */
    public filter(filter: ArrayDataSourceFilter<TData>): TData[] {
        this.removeFilter();

        this.filterProcessor = (data: TData[]) => data.filter(filter);

        return this.addProcessor(this.filterProcessor);
    }

    /**
     * Filters the data by whether the entry is truthy
     *
     * Essentially:
     * (entry) => !!entry
     */
    public filterBy(): TData[];
    /**
     * Filters the data by whether the supplied property of each entry is truthy
     *
     * Essentially:
     * (entry) => !!entry[property]
     *
     * @param property The property to filter the data by
     */
    public filterBy<TKey extends keyof TData>(property: TKey): TData[];
    /**
     * Filters the data by strict equality of the supplied property of each entry to the supplied value
     *
     * Essentially:
     * (entry) => entry[property] === value
     *
     * @param property The property to filter the data by
     * @param value The value to filter the data by
     */
    public filterBy<TKey extends keyof TData, TValue extends TData[TKey]>(property: TKey, value: TValue): TData[];
    public filterBy<TKey extends keyof TData, TValue extends TData[TKey]>(property?: TKey, value?: TValue): TData[] {
        return property == null
            ? this.filter(entry => !!entry)
            : arguments.length === 1
                ? this.filter(entry => !!entry[property])
                : this.filter(entry => entry[property] === value);
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
    public sort(sorter: ArrayDataSourceSorter<TData>): TData[] {
        if (this.sortProcessor) {
            this.removeProcessor(this.sortProcessor);
        }

        this.sortProcessor = (data: TData[]) => data.sort(sorter);

        return this.addProcessor(this.sortProcessor);
    }

    /**
     * Sorts the data by comparing each entry
     *
     * Essentially:
     * (a, b) => a === b ? 0 : a > b ? 1 : -1;
     */
    public sortBy(): TData[];
    /**
     * Sorts the data by comparing the property of each entry
     *
     * Essentially:
     * (a, b) => a[property] === b[property] ? 0 : a[property] > b[property] ? 1 : -1;
     *
     * @param property The property to sort the data by
     */
    public sortBy<TKey extends keyof TData>(property: TKey): TData[];
    public sortBy<TKey extends keyof TData>(property?: TKey): TData[] {
        return property == null
            ? this.sort((entry1, entry2) => {
                  if (entry1 === entry2) {
                      return 0;
                  } else if (entry1 > entry2) {
                      return 1;
                  } else {
                      return -1;
                  }
              })
            : this.sort((entry1, entry2) => {
                  if (entry1 == null && entry2 == null) {
                      return 0;
                  } else if (entry1 == null) {
                      return -1;
                  } else if (entry2 == null) {
                      return 1;
                  } else if (entry1[property] === entry2[property]) {
                      return 0;
                  } else if (entry1[property] > entry2[property]) {
                      return 1;
                  } else {
                      return -1;
                  }
              });
    }

    /**
     * Removes the data sort if it exists
     */
    public removeSort() {
        return this.sortProcessor ? this.removeProcessor(this.sortProcessor) : this.processedData;
    }
}
