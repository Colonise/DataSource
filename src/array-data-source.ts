import { DataSource } from './data-source';
import { FilterProcessor, PagerProcessor, Processor, SorterProcessor } from './processors';

/**
 * A class to handle temporal changes in an array while not mutating the array itself.
 */
export class ArrayDataSource<TEntry> extends DataSource<TEntry[]> {
    // tslint:disable-next-line:variable-name
    protected _filter?: FilterProcessor<TEntry>;

    get filter(): FilterProcessor<TEntry> | undefined {
        return this._filter;
    }
    set filter(filter: FilterProcessor<TEntry> | undefined) {
        this._filter = filter;

        this.processData();
    }

    // tslint:disable-next-line:variable-name
    protected _sorter?: SorterProcessor<TEntry>;

    get sorter(): SorterProcessor<TEntry> | undefined {
        return this._sorter;
    }
    set sorter(sorter: SorterProcessor<TEntry> | undefined) {
        this._sorter = sorter;

        this.processData();
    }

    // tslint:disable-next-line:variable-name
    protected _pager?: PagerProcessor<TEntry>;

    get pager(): PagerProcessor<TEntry> | undefined {
        return this._pager;
    }
    set pager(pager: PagerProcessor<TEntry> | undefined) {
        this._pager = pager;

        this.processData();
    }

    /**
     * Creates a new ArrayDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TEntry[]) {
        super(array);

        this.preprocessors.push(this.processor);
    }

    protected processor(array: TEntry[]) {
        let processedArray = array;

        if (this.filter) {
            processedArray = this.filter.process(processedArray);
        }

        if (this.sorter) {
            processedArray = this.sorter.process(processedArray);
        }

        if (this.pager) {
            processedArray = this.pager.process(processedArray);
        }

        return processedArray;
    }
}
