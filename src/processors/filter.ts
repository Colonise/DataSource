import { isBoolean, isFunction, isObject, isVoid } from '../utils';
import { ArrayProcessor, ArrayProcessorApi } from './array';

/**
 * Filters an array using truthiness.
 */
export type BooleanFilter = boolean;

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
 * Union type of BooleanSorter | PropertyFilter<TEntry> | PropertyAndValueFilter<TEntry> | FunctionFilter<TEntry>
 */
export type Filter<TEntry> =
    | BooleanFilter
    | PropertyFilter<TEntry>
    | PropertyAndValueFilter<TEntry>
    | FunctionFilter<TEntry>
    | void;

/**
 * The public API of a FilterProcessor.
 */
export interface FilterProcessorApi<TEntry> extends ArrayProcessorApi<TEntry> {
    /**
     * Filters the array.
     *
     * True:   (entry) => !!entry;
     * False:  (entry) => !entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    filter: Filter<TEntry>;
}

/**
 * An array processor to automatically sort an array using the supplied filter.
 */
export class FilterProcessor<TEntry> extends ArrayProcessor<TEntry> implements FilterProcessorApi<TEntry> {
    protected inputFilter: Filter<TEntry> | void = undefined;

    protected currentFilter: FunctionFilter<TEntry> | void = undefined;

    /**
     * Filters the array.
     *
     * True:   (entry) => !!entry;
     * False:  (entry) => !entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    public get filter(): Filter<TEntry> {
        return this.inputFilter;
    }
    public set filter(filter: Filter<TEntry>) {
        this.inputFilter = filter;

        if (isVoid(filter)) {
            this.currentFilter = filter;
        } else if (isBoolean(filter)) {
            this.currentFilter = this.booleanFilterToFunctionFilter(filter);
        } else if (isFunction(filter)) {
            this.currentFilter = filter;
        } else if (isObject(filter)) {
            this.currentFilter = this.propertyAndValueFilterToFunctionFilter(filter);
        } else {
            this.currentFilter = this.propertyFilterToFunctionFilter(filter);
        }

        this.reprocess();
    }

    /**
     * Creates a new FilterProcessor.
     *
     * @param active Whether the FilterProcessor should start active.
     */
    public constructor(active: boolean = true) {
        super(active);
    }

    protected processor(array: TEntry[]) {
        return this.currentFilter ? array.filter(this.currentFilter) : array;
    }

    protected booleanFilterToFunctionFilter(filter: boolean): FunctionFilter<TEntry> {
        return filter ? entry => !!entry : entry => !entry;
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
