export function insert<T>(array: T[], index: number, item: T): T[];
export function insert<T>(array: T[], index: number, items: T[]): T[];
export function insert<T>(array: T[], index: number, itemOrItems: T | T[]) {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

    array.splice(index, 0, ...items);

    return array;
}

export function remove<T>(array: T[], item: T): T[];
export function remove<T>(array: T[], items: T[]): T[];
export function remove<T>(array: T[], index: number, count?: number): T[];
export function remove<T>(array: T[], indexOrItemOrItems: number | T | T[], count: number = 1) {
    if (typeof indexOrItemOrItems === 'number') {
        array.splice(indexOrItemOrItems, count);
    } else if (Array.isArray(indexOrItemOrItems)) {
        indexOrItemOrItems.forEach(item => remove(array, item));
    } else {
        const index = array.indexOf(indexOrItemOrItems);

        array.splice(index, 1);
    }

    return array;
}

export type Finder<T> = (item: T, index: number, array: T[]) => boolean;

export function find<T>(array: T[], item: T): T | undefined;
export function find<T>(array: T[], finder: Finder<T>): T | undefined;
export function find<T>(array: T[], itemOrFinder: T | Finder<T>) {
    const finder: Finder<T> = typeof itemOrFinder === 'function' ? itemOrFinder : item => item === itemOrFinder;

    for (let i = 0; i < array.length; i++) {
        if (finder(array[i], i, array)) {
            return array[i];
        }
    }

    return undefined;
}

export function findIndex<T>(array: T[], item: T): number;
export function findIndex<T>(array: T[], finder: Finder<T>): number;
export function findIndex<T>(array: T[], itemOrFinder: T | Finder<T>) {
    const finder: Finder<T> = typeof itemOrFinder === 'function' ? itemOrFinder : item => item === itemOrFinder;

    for (let i = 0; i < array.length; i++) {
        if (finder(array[i], i, array)) {
            return i;
        }
    }

    return -1;
}

export function clone<T>(object: T): T {
    if (typeof object !== 'object' || object === null) {
        return object;
    } else if (Array.isArray(object)) {
        // tslint:disable-next-line:no-any
        return <any>object.slice();
    } else {
        // tslint:disable-next-line:no-any
        return { ...(<any>object) };
    }
}

// tslint:disable-next-line:no-any
export function isBoolean(obj: any): obj is boolean {
    return typeof obj === 'boolean';
}

// tslint:disable-next-line:no-any
export function isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

// tslint:disable-next-line:no-any
export function isNumber(obj: any): obj is number {
    return typeof obj === 'number';
}

// tslint:disable-next-line:no-any
export function isObject(obj: any): obj is object {
    return typeof obj === 'object' && obj !== null;
}

// tslint:disable-next-line:no-any
export function isString(obj: any): obj is string {
    return typeof obj === 'string';
}

// tslint:disable-next-line:no-any
export function isUndefined(obj: any): obj is undefined {
    return typeof obj === 'undefined';
}

// tslint:disable-next-line:no-any
export function isNull(obj: any): obj is null {
    return obj === null;
}

// tslint:disable-next-line:no-any
export function isVoid(obj: any): obj is void {
    return obj == null;
}
