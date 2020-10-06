import { ArrayDataSource } from './array-data-source';
import {
    FilterProcessor,
    PagerProcessor,
    SorterProcessor
} from '../processors';
import type {
    FilterProcessorApi,
    PagerProcessorApi,
    SorterProcessorApi
} from '../processors';

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
     * @param array The original array.
     * @param filtering Whether filtering should be active.
     * @param sorting Whether the sorting should be active.
     * @param paging Whether the paging should be active.
     */
    public constructor(array: TRow[] = [], filtering: boolean = true, sorting: boolean = true, paging: boolean = true) {
        super(array);

        this.filterProcessor.active = filtering;
        this.sorterProcessor.active = sorting;
        this.pagerProcessor.active = paging;

        this.preprocessors.addProcessor(this.filterProcessor);
        this.preprocessors.addProcessor(this.sorterProcessor);
        this.preprocessors.addProcessor(this.pagerProcessor);
    }
}
