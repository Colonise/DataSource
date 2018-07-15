export function insert<T>(array: T[], index: number, item: T): T[];
export function insert<T>(array: T[], index: number, items: T[]): T[];
export function insert<T>(array: T[], index: number, itemOrItems: T | T[]) {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

    return array.splice(index, 0, ...items);
}

export function remove<T>(array: T[], item: T): T[];
export function remove<T>(array: T[], items: T[]): T[];
export function remove<T>(array: T[], index: number, count?: number): T[];
export function remove<T>(array: T[], indexOrItemOrItems: number | T | T[], count: number = 1) {
    if (typeof indexOrItemOrItems === 'number') {
        return array.splice(indexOrItemOrItems, count);
    } else if (Array.isArray(indexOrItemOrItems)) {
        const newArray = array;

        indexOrItemOrItems.forEach(item => remove(newArray, item));

        return newArray;
    } else {
        const index = array.indexOf(indexOrItemOrItems);

        return array.splice(index, 1);
    }
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
        return <any>object.slice();
    } else {
        return { ...(<any>object) };
    }
}
