import { ArrayProcessor, ArrayProcessorApi } from './array';

/**
 * Paginates an array with the given page size.
 */
export type Pager<TEntry> = (pageSize: number, array: TEntry[]) => TEntry[][];

/**
 * The public API of a PagerProcessor.
 */
export interface PagerProcessorApi<TEntry> extends ArrayProcessorApi<TEntry> {
    /**
     * The current page.
     */
    page: number;
    /**
     * The number of entries to show per page.
     */
    pageSize: number;
}

/**
 * An array processor to automatically paginate an array using the supplied page and page size.
 */
export class PagerProcessor<TEntry> extends ArrayProcessor<TEntry> implements PagerProcessorApi<TEntry> {
    protected pager: Pager<TEntry>;

    // tslint:disable-next-line:variable-name
    protected _page: number = 1;

    /**
     * The current page.
     */
    public get page(): number {
        return this._page;
    }
    public set page(page: number) {
        if (page <= 0) {
            throw TypeError(`pageSize must be a positive whole number, got ${page}`);
        }

        this._page = page;

        this.next(this.currentPageEntries());
    }

    // tslint:disable-next-line:variable-name
    protected _pageSize: number = 20;

    /**
     * The number of entries to show per page.
     */
    public get pageSize(): number {
        return this._pageSize;
    }
    public set pageSize(pageSize: number) {
        if (pageSize <= 0) {
            throw TypeError(`pageSize must be a positive whole number, got ${pageSize}`);
        }

        this._pageSize = pageSize;

        this.reprocess();
    }

    protected pages: TEntry[][] = [];

    /**
     * Creates a new PagerProcessor.
     *
     * @param active Whether the PagerProcessor should start active.
     */
    public constructor(active: boolean = true) {
        super(active);

        this.pager = this.defaultPager;
    }

    protected processor(array: TEntry[]) {
        this.pages = this.pager(this.pageSize, array);

        return this.currentPageEntries();
    }

    protected currentPageEntries() {
        return this.pages[this._page - 1] || [];
    }

    protected defaultPager: Pager<TEntry> = (pageSize, array) => {
        const groups = Math.ceil(array.length / pageSize);
        const pages: TEntry[][] = [];

        for (let i = 0; i < groups; i++) {
            const start = i * pageSize;
            const end = start + pageSize;

            pages.push(array.slice(start, end));
        }

        return pages;
    }
}
