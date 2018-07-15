import { DataSource } from './data-source';
import { Filter, FilterProcessor, PagerProcessor, Sorter, SorterProcessor } from './processors';

/**
 * A class to handle temporal changes in a table's array while not mutating the array.
 */
export class TableDataSource<TEntry> extends DataSource<TEntry[]> {
    protected filterProcessor: FilterProcessor<TEntry> = new FilterProcessor<TEntry>();
    protected sorterProcessor: SorterProcessor<TEntry> = new SorterProcessor<TEntry>();
    protected pagerProcessor: PagerProcessor<TEntry> = new PagerProcessor<TEntry>();

    /**
     * Filters the table.
     *
     * Void:   (entry) => !!entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    get filter(): Filter<TEntry> {
        return this.filterProcessor.filter;
    }
    set filter(filter: Filter<TEntry>) {
        this.filterProcessor.filter = filter;

        this.process();
    }

    /**
     * Sorts the table.
     *
     * Void:   (entryA, entryB) => entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
     * String: (entryA, entryB) => entryA[sorter] < entryB[sorter] ? -1 : entryA[sorter] > entryB[sorter] ? 1 : 0;
     */
    get sorter(): Sorter<TEntry> {
        return this.sorter;
    }
    set sorter(sorter: Sorter<TEntry>) {
        this.sorterProcessor.sorter = sorter;

        this.process();
    }

    /**
     * TODO
     */
    get page(): number {
        return this.pagerProcessor.page;
    }
    set page(page: number) {
        this.pagerProcessor.page = page;
    }

    /**
     * TODO
     */
    get pageSize(): number {
        return this.pagerProcessor.pageSize;
    }
    set pageSize(pageSize: number) {
        this.pagerProcessor.pageSize = pageSize;
    }

    /**
     * Creates a new ArrayDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TEntry[]) {
        super(array);

        this.preprocessors.addProcessor(this.filterProcessor);
        this.preprocessors.addProcessor(this.sorterProcessor);
        this.preprocessors.addProcessor(this.pagerProcessor);
    }
}
