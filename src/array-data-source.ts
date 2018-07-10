import { DataSource, DataSourceProcessor } from './data-source';

export type ArrayDataSourceFilter<TData> = (value: TData, index: number, array: TData[]) => boolean;
export type ArrayDataSourceSorter<TData> = (data1: TData, data2: TData) => 1 | 0 | -1;

export class ArrayDataSource<TData> extends DataSource<TData[]> {
    protected filterProcessor?: DataSourceProcessor<TData[]>;
    protected sortProcessor?: DataSourceProcessor<TData[]>;

    public filter(filter: ArrayDataSourceFilter<TData>): TData[] {
        this.removeFilter();

        this.filterProcessor = (data: TData[]) => data.filter(filter);

        return this.addProcessor(this.filterProcessor);
    }

    public filterBy<TKey extends keyof TData, TValue extends TData[TKey]>(property: TKey, value: TValue): TData[] {
        return this.filter(data => data[property] === value);
    }

    public removeFilter() {
        return this.filterProcessor ? this.removeProcessor(this.filterProcessor) : this.processedData;
    }

    public sort(sorter: ArrayDataSourceSorter<TData>): TData[] {
        if (this.sortProcessor) {
            this.removeProcessor(this.sortProcessor);
        }

        this.sortProcessor = (data: TData[]) => data.sort(sorter);

        return this.addProcessor(this.sortProcessor);
    }

    public sortBy<TKey extends keyof TData>(property: TKey): TData[] {
        return this.sort((data1, data2) => {
            if (!data1 && !data2) {
                return 0;
            } else if (!data1) {
                return -1;
            } else if (!data2) {
                return 1;
            } else {
                const data1String = `${data1[property]}`;
                const data2String = `${data2[property]}`;

                if (data1String === data2String) {
                    return 0;
                } else {
                    return data1String > data2String ? 1 : -1;
                }
            }
        });
    }

    public removeSort() {
        return this.sortProcessor ? this.removeProcessor(this.sortProcessor) : this.processedData;
    }
}
