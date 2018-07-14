export type DataSourceProcessor<TData> = (data: TData) => TData;

export interface ComplexDataSourceProcessor<TData> {
    readonly processor: DataSourceProcessor<TData>;
    active: boolean;
}

export type ArrayDataSourceProcessor<TEntry> = DataSourceProcessor<TEntry[]>;

export interface ComplexArrayDataSourceProcessor<TEntry> extends ComplexDataSourceProcessor<TEntry[]> {
    readonly processor: ArrayDataSourceProcessor<TEntry>;
}

export type ArrayDataSourceFilter<TEntry> = (value: TEntry, index: number, array: TEntry[]) => boolean;

export interface ArrayDataSourceFilterProcessor<TEntry> extends ComplexArrayDataSourceProcessor<TEntry> {
    filter: ArrayDataSourceFilter<TEntry>;
}

export type ArrayDataSourceSorter<TEntry> = (entryA: TEntry, entryB: TEntry) => 1 | 0 | -1;

export interface ArrayDataSourceSorterProcessor<TEntry> extends ComplexArrayDataSourceProcessor<TEntry> {
    sorter: ArrayDataSourceSorter<TEntry>;
}

export type ArrayDataSourcePager<TEntry> = (page: number, pageSize: number, array: TEntry[]) => TEntry[];

export interface ArrayDataSourcePagerProcessor<TEntry> extends ComplexArrayDataSourceProcessor<TEntry> {
    pager: ArrayDataSourcePager<TEntry>;
    page: number;
    pageSize: number;
}
