import { ComplexProcessor } from './complex';

export type Pager<TEntry> = (pageSize: number, array: TEntry[]) => TEntry[][];

/**
 * An array processor to automatically paginate an array using the supplied page and page size.
 */
export class PagerProcessor<TEntry> extends ComplexProcessor<TEntry[]> {
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
        this._page = page;

        this.reprocess();
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

        this.next(this.currentPageEntries());
    }

    protected pages: TEntry[][] = [];
    protected arrayCache: TEntry[] = [];

    /**
     * Creates a new PagerProcessor.
     */
    public constructor(active: boolean = true) {
        super([], active);

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
