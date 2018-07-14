import { CachedProcessor } from './cached-processor';

export type Pager<TEntry> = (pageSize: number, array: TEntry[]) => TEntry[][];

export class PagerProcessor<TEntry> extends CachedProcessor<TEntry[]> {
    public pager: Pager<TEntry>;

    public get page(): number {
        return this._page;
    }
    public set page(page: number) {
        this._page = page;

        this.updateCache();
    }

    public get pageSize(): number {
        return this._pageSize;
    }
    public set pageSize(pageSize: number) {
        this._pageSize = pageSize;

        this.updateCache();
    }

    // tslint:disable-next-line:variable-name
    protected _page: number = 1;
    // tslint:disable-next-line:variable-name
    protected _pageSize: number = 20;
    protected pages: TEntry[][] = [];
    protected cache: TEntry[] = [];
    protected arrayCache: TEntry[] = [];

    constructor() {
        super();

        this.pager = this.defaultPager;
    }

    protected processor(array: TEntry[]) {
        this.arrayCache = array;

        this.updatePages();
        this.updateCache();

        return this.cache;
    }

    protected updatePages() {
        this.pages = this.pager(this.pageSize, this.arrayCache);
    }

    protected updateCache() {
        this.cache = this.pages[this._page] || [];
    }

    protected defaultPager: Pager<TEntry> = (pageSize, array) => {
        const groups = Math.ceil(array.length / pageSize);
        const pages: TEntry[][] = [];

        for (let i = 0; i < groups; i++) {
            pages.push(array.slice(i, i * pageSize + pageSize));
        }

        return pages;
    }
}
