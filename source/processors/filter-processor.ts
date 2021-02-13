import { ArrayProcessor } from './array-processor';
import type { ArrayProcessorApi } from './array-processor';
import {
    isBoolean,
    isFunction,
    isObject,
    isVoid,
    toBoolean
} from '@colonise/utilities';

/**
 * Filters an array using truthiness.
 */
export type BooleanFilter = boolean;

/**
 * Filters an array by a property using truthiness.
 */
// eslint-disable-next-line @typescript-eslint/no-type-alias
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
    | FunctionFilter<TEntry>;

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
    filter?: Filter<TEntry>;
}

export interface FilterProcessorOptions<TEntry> {

    /**
     * Filters the array.
     *
     * True:   (entry) => !!entry;
     * False:  (entry) => !entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    filter?: Filter<TEntry>;

    /**
     * Whether this processor is active.
     *
     * An inactive processor returns the data it is supplied.
     */
    active?: boolean;
}

/**
 * An array processor to automatically sort an array using the supplied filter.
 */
export class FilterProcessor<TEntry> extends ArrayProcessor<TEntry> implements FilterProcessorApi<TEntry> {
    protected inputFilter: Filter<TEntry> | undefined;

    protected currentFilter: FunctionFilter<TEntry> | undefined;

    /**
     * Filters the array.
     *
     * True:   (entry) => !!entry;
     * False:  (entry) => !entry;
     * Object: (entry) => entry[filter.property] === filter.value;
     * String: (entry) => !!entry[filter];
     */
    public get filter(): Filter<TEntry> | undefined {
        return this.inputFilter;
    }
    public set filter(filter: Filter<TEntry> | undefined) {
        this.inputFilter = filter;

        this.currentFilter = this.convertFilterToFunctionFilter(filter);

        this.reprocess();
    }

    /**
     * Creates a new FilterProcessor.
     *
     * @param options The FilterProcessor options.
     */
    public constructor(options?: FilterProcessorOptions<TEntry>) {
        super(options?.active ?? true);

        const filter = options?.filter ?? undefined;

        this.inputFilter = filter;
        this.currentFilter = this.convertFilterToFunctionFilter(filter);
    }

    protected processor(array: TEntry[]): TEntry[] {
        return this.currentFilter ? array.filter(this.currentFilter) : array;
    }

    protected convertBooleanFilterToFunctionFilter(filter: boolean): FunctionFilter<TEntry> {
        return filter ? entry => toBoolean(entry) : entry => !toBoolean(entry);
    }

    protected convertPropertyFilterToFunctionFilter(property: PropertyFilter<TEntry>): FunctionFilter<TEntry> {
        return entry => Boolean(entry[property]);
    }

    protected convertPropertyAndValueFilterToFunctionFilter(
        propertyAndValue: PropertyAndValueFilter<TEntry>
    ): FunctionFilter<TEntry> {
        return entry => entry[propertyAndValue.property] === propertyAndValue.value;
    }

    private convertFilterToFunctionFilter(filter: Filter<TEntry> | undefined): FunctionFilter<TEntry> | undefined {
        if (isVoid(filter)) {
            return undefined;
        }

        if (isBoolean(filter)) {
            return this.convertBooleanFilterToFunctionFilter(filter);
        }

        if (isFunction(filter)) {
            return filter;
        }

        if (isObject(filter)) {
            return this.convertPropertyAndValueFilterToFunctionFilter(filter);
        }

        return this.convertPropertyFilterToFunctionFilter(filter);
    }
}
