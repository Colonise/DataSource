import { DataSource } from './data-source';
import { Filter, FilterProcessor, PagerProcessor, Sorter, SorterProcessor } from './processors';
import { remove } from './utils';

/**
 * A class to handle temporal changes in a table's array while not mutating the array.
 */
export class TableDataSource<TRow> extends DataSource<TRow[]> {
    protected filterProcessor: FilterProcessor<TRow> = new FilterProcessor<TRow>();
    protected sorterProcessor: SorterProcessor<TRow> = new SorterProcessor<TRow>();
    protected pagerProcessor: PagerProcessor<TRow> = new PagerProcessor<TRow>();

    /**
     * Whether the table will filter.
     */
    public get filtering(): boolean {
        return this.filterProcessor.active;
    }
    public set filtering(active: boolean) {
        this.filterProcessor.active = active;
    }

    /**
     * Filters the table.
     *
     * True:   (entry) => !!entry;
     * False:  (entry) => !entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    public get filter(): Filter<TRow> {
        return this.filterProcessor.filter;
    }
    public set filter(filter: Filter<TRow>) {
        this.filterProcessor.filter = filter;
    }

    /**
     * Whether the table will sort.
     */
    public get sorting(): boolean {
        return this.sorterProcessor.active;
    }
    public set sorting(active: boolean) {
        this.sorterProcessor.active = active;
    }

    /**
     * Sorts the table.
     *
     * Setting as a boolean sets the direction.
     *
     * Boolean: (entryA, entryB) => entryA < entryB ? -1 : entryA > entryB ? 1 : 0;
     * String:  (entryA, entryB) => entryA[sorter] < entryB[sorter] ? -1 : entryA[sorter] > entryB[sorter] ? 1 : 0;
     */
    public get sorter(): Sorter<TRow> {
        return this.sorterProcessor.sorter;
    }
    public set sorter(sorter: Sorter<TRow>) {
        this.sorterProcessor.sorter = sorter;
    }

    /**
     * Whether the table will paginate.
     */
    public get paginate(): boolean {
        return this.pagerProcessor.active;
    }
    public set paginate(active: boolean) {
        this.pagerProcessor.active = active;
    }

    /**
     * The current page.
     */
    public get page(): number {
        return this.pagerProcessor.page;
    }
    public set page(page: number) {
        this.pagerProcessor.page = page;
    }

    /**
     * The current page size.
     */
    public get pageSize(): number {
        return this.pagerProcessor.pageSize;
    }
    public set pageSize(pageSize: number) {
        this.pagerProcessor.pageSize = pageSize;
    }

    /**
     * The total number of rows in the processed table.
     */
    public get length(): number {
        return this.value.length;
    }

    /**
     * Creates a new TableDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TRow[]) {
        super(array);

        this.preprocessors.addProcessor(this.filterProcessor);
        this.preprocessors.addProcessor(this.sorterProcessor);
        this.preprocessors.addProcessor(this.pagerProcessor);
    }

    /**
     * Appends the rows to the table.
     *
     * @param rows The rows to append.
     * @returns The newly processed table.
     */
    public push(...rows: TRow[]) {
        this.data.push(...rows);

        return this.process();
    }

    /**
     * Removes the row from the table.
     *
     * @param row The row to remove.
     * @returns The newly processed table.
     */
    public remove(row: TRow): TRow[];
    /**
     * Removes the rows from the table.
     *
     * @param rows The rows to remove.
     * @returns The newly processed table.
     */
    public remove(rows: TRow[]): TRow[];
    /**
     * Removes a number of rows from the table from the supplied index and count.
     *
     * @param index The index of the first row to remove
     * @param count The number of rows to remove. Defaults to 1.
     * @returns The newly processed table.
     */
    public remove(index: number, count?: number): TRow[];
    public remove(indexOrRowOrRows: number | TRow | TRow[], count: number = 1) {
        if (typeof indexOrRowOrRows === 'number') {
            remove(this.data, indexOrRowOrRows, count);
        } else {
            remove(this.data, indexOrRowOrRows);
        }

        return this.process();
    }
}
