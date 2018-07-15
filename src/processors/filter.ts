import { ComplexProcessor } from './complex';

/**
 * Filters an array using truthiness.
 */
export type VoidFilter = void;

/**
 * Filters an array by a property using truthiness.
 */
export type PropertyFilter<TEntry> = keyof TEntry;

/**
 * Filters an array by a property using truthiness and strict equality to the supplied value.
 */
export interface PropertyAndValueFilter<TEntry> {
    property: keyof TEntry;
    value: TEntry[keyof TEntry];
}

/**
 * Filters an array.
 */
export type FunctionFilter<TEntry> = (value: TEntry, index: number, array: TEntry[]) => boolean;

/**
 * Union type of VoidFilter | PropertyFilter<TEntry> | PropertyAndValueFilter<TEntry> | FunctionFilter<TEntry>
 */
export type Filter<TEntry> =
    | VoidFilter
    | PropertyFilter<TEntry>
    | PropertyAndValueFilter<TEntry>
    | FunctionFilter<TEntry>;

/**
 * An array processor to automatically sort an array using the supplied filter.
 */
export class FilterProcessor<TEntry> extends ComplexProcessor<TEntry[]> {
    protected inputFilter?: Filter<TEntry>;

    protected currentFilter: FunctionFilter<TEntry> = this.voidFilterToFunctionFilter();

    constructor() {
        super([]);
    }

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
            this.currentFilter = this.voidFilterToFunctionFilter();
        } else if (typeof filter === 'function') {
            this.currentFilter = filter;
        } else if (typeof filter === 'object') {
            this.currentFilter = this.propertyAndValueFilterToFunctionFilter(filter);
        } else {
            this.currentFilter = this.propertyFilterToFunctionFilter(filter);
        }

        this.reprocess();
    }

    protected processor(array: TEntry[]) {
        return array.filter(this.currentFilter);
    }

    protected voidFilterToFunctionFilter(): FunctionFilter<TEntry> {
        return entry => !!entry;
    }

    protected propertyFilterToFunctionFilter(property: PropertyFilter<TEntry>): FunctionFilter<TEntry> {
        return entry => !!entry[property];
    }

    protected propertyAndValueFilterToFunctionFilter(
        propertyAndValue: PropertyAndValueFilter<TEntry>
    ): FunctionFilter<TEntry> {
        return entry => entry[propertyAndValue.property] === propertyAndValue.value;
    }
}
