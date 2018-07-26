import { DataSource } from './data-source';
import {
    FilterProcessor,
    FilterProcessorApi,
    PagerProcessor,
    PagerProcessorApi,
    SorterProcessor,
    SorterProcessorApi
} from './processors';
import { remove } from './utils';

/**
 * A class to handle temporal changes in a table's array while not mutating the array.
 */
export class TableDataSource<TRow> extends DataSource<TRow[]> {
    protected filterProcessor: FilterProcessor<TRow> = new FilterProcessor<TRow>();
    protected sorterProcessor: SorterProcessor<TRow> = new SorterProcessor<TRow>();
    protected pagerProcessor: PagerProcessor<TRow> = new PagerProcessor<TRow>();

    /**
     * The filtering processor.
     */
    public get filtering(): FilterProcessorApi<TRow> {
        let foo = 1;
        foo++;
        console.log(foo);
        return this.filterProcessor;
    }

    /**
     * The sorting processor.
     */
    public get sorting(): SorterProcessorApi<TRow> {
        return this.sorterProcessor;
    }

    /**
     * The paging processor.
     */
    public get paging(): PagerProcessorApi<TRow> {
        return this.pagerProcessor;
    }

    /**
     * The total number of rows in the table before processing.
     */
    public get length(): number {
        return this.data.length;
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
