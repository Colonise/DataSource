import {
    FilterProcessor,
    FilterProcessorApi,
    PagerProcessor,
    PagerProcessorApi,
    SorterProcessor,
    SorterProcessorApi
} from '../processors';
import { ArrayDataSource } from './array-data-source';

/**
 * A class to handle temporal changes in a table's array while not mutating the array.
 */
export class TableDataSource<TRow> extends ArrayDataSource<TRow> {
    protected filterProcessor: FilterProcessor<TRow> = new FilterProcessor<TRow>();
    protected sorterProcessor: SorterProcessor<TRow> = new SorterProcessor<TRow>();
    protected pagerProcessor: PagerProcessor<TRow> = new PagerProcessor<TRow>();

    /**
     * The filtering processor.
     */
    public get filtering(): FilterProcessorApi<TRow> {
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
}
