import { CachedProcessor } from './cached-processor';

/**
 * TODO
 */
export type VoidFilter = void;

/**
 * TODO
 */
export type CustomFilter<TEntry> = (value: TEntry, index: number, array: TEntry[]) => boolean;

/**
 * TODO
 */
export type PropertyFilter<TEntry> = keyof TEntry;

/**
 * TODO
 */
export interface PropertyAndValueFilter<TEntry> {
    property: keyof TEntry;
    value: TEntry[keyof TEntry];
}

/**
 * TODO
 */
export type Filter<TEntry> =
    | VoidFilter
    | CustomFilter<TEntry>
    | PropertyFilter<TEntry>
    | PropertyAndValueFilter<TEntry>;

/**
 * TODO
 */
export class FilterProcessor<TEntry> extends CachedProcessor<TEntry[]> {
    protected cache: TEntry[] = [];

    protected inputFilter?: Filter<TEntry>;
    protected currentFilter: CustomFilter<TEntry> = entry => !!entry;

    /**
     * Filters the array.
     *
     * Void:   (entry) => !!entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    public get filter(): Filter<TEntry> {
        return this.inputFilter;
    }
    public set filter(filter: Filter<TEntry>) {
        this.inputFilter = filter;

        if (filter == null) {
            this.currentFilter = entry => !!entry;
        } else if (typeof filter === 'function') {
            this.currentFilter = filter;
        } else if (typeof filter === 'object') {
            this.currentFilter = entry => entry[filter.property] === filter.value;
        } else {
            this.currentFilter = entry => !!entry[filter];
        }

        this.active = true;
    }

    protected processor(array: TEntry[]) {
        return array.filter(this.currentFilter);
    }
}
