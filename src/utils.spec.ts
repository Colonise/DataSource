import { Expect, Test, TestCase, TestFixture } from 'alsatian';
import {
    clone,
    find,
    Finder,
    findIndex,
    insert,
    isBoolean,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isUndefined,
    isVoid,
    remove
} from './utils';

@TestFixture('Utils Tests')
export class UtilsTests {
    @TestCase(['a', 'b', 'd', 'e'], ['a', 'b', 'c', 'd', 'e'], 2, 'c')
    @Test('insert<T>(array: T[], index: number, item: T) should insert an item into an array')
    public insert1<T>(array: T[], expected: T[], index: number, item: T) {
        const actual = insert(array, index, item);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'e'], ['a', 'b', 'c', 'd', 'e'], 2, ['c', 'd'])
    @Test('insert<T>(array: T[], index: number, items: T[]) should insert an array of items into an array')
    public insert2<T>(array: T[], expected: T[], index: number, items: T[]) {
        const actual = insert(array, index, items);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'd', 'e'], 2)
    @Test('remove<T>(array: T[], item: T) should remove an item from an array')
    public remove1<T>(array: T[], expected: T[], item: T) {
        const actual = remove(array, item);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'e'], ['c', 'd'])
    @Test('remove<T>(array: T[], items: T[]) should remove an array of items from an array')
    public remove2<T>(array: T[], expected: T[], items: T[]) {
        const actual = remove(array, items);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'e'], 2, 2)
    @Test(
        'remove<T>(array: T[], index: number, count?: number) should remove a count of items from an array by an index'
    )
    public remove3<T>(array: T[], expected: T[], index: number, count: number) {
        const actual = remove(array, index, count);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], 'c', 'c')
    @TestCase(['a', 'b', 'c', 'd', 'e'], undefined, 'f')
    @Test('find<T>(array: T[], item: T) should return an item')
    public find1<T>(array: T[], expected: T, item: T) {
        const actual = find(array, item);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], undefined, <Finder<string>>(item => item === 'f'))
    @Test('find<T>(array: T[], finder: Finder<T>) should use a finder to return an item')
    public find2<T>(array: T[], expected: T, finder: Finder<T>) {
        const actual = find(array, finder);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], -1, 'f')
    @Test('findIndex<T>(array: T[], item: T) should return the index of an item')
    public findIndex1<T>(array: T[], expected: T, item: T) {
        const actual = findIndex(array, item);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], -1, <Finder<string>>(item => item === 'f'))
    @Test('findIndex<T>(array: T[], finder: Finder<T>) should use a finder to return an index')
    public findIndex2<T>(array: T[], expected: T, finder: Finder<T>) {
        const actual = findIndex(array, finder);

        Expect(actual).toEqual(expected);
    }

    @TestCase(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'c', 'd', 'e'])
    @TestCase({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })
    @Test('clone<T>(object: T) should clone an object')
    public clone1<T>(object: T, expected: T) {
        const actual = clone(object);

        Expect(actual).toEqual(expected);
    }

    @TestCase(true, true)
    @TestCase(false, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isBoolean(obj: any) should check if a variable is a boolean')
    public isBoolean1<T>(object: T, expected: boolean) {
        const actual = isBoolean(object);

        Expect(actual).toBe(expected);
    }

    // tslint:disable-next-line:no-empty
    @TestCase(() => {}, true)
    // tslint:disable-next-line:no-empty
    @TestCase(function() {}, true)
    @TestCase(Function, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isFunction(obj: any) should check if a variable is a function')
    public isFunction1<T>(object: T, expected: boolean) {
        const actual = isFunction(object);

        Expect(actual).toBe(expected);
    }

    @TestCase(1, true)
    @TestCase(0, true)
    @TestCase(NaN, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isNumber(obj: any) should check if a variable is a number')
    public isNumber1<T>(object: T, expected: boolean) {
        const actual = isNumber(object);

        Expect(actual).toBe(expected);
    }

    @TestCase([], true)
    @TestCase({}, true)
    @TestCase(null, false)
    @TestCase(1, false)
    @Test('isObject(obj: any) should check if a variable is a object')
    public isObject1<T>(object: T, expected: boolean) {
        const actual = isObject(object);

        Expect(actual).toBe(expected);
    }

    @TestCase('a', true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isString(obj: any) should check if a variable is a string')
    public isString1<T>(object: T, expected: boolean) {
        const actual = isString(object);

        Expect(actual).toBe(expected);
    }

    @TestCase(undefined, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isUndefined(obj: any) should check if a variable is undefined')
    public isUndefined1<T>(object: T, expected: boolean) {
        const actual = isUndefined(object);

        Expect(actual).toBe(expected);
    }

    @TestCase(null, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isNull(obj: any) should check if a variable is null')
    public isNull1<T>(object: T, expected: boolean) {
        const actual = isNull(object);

        Expect(actual).toBe(expected);
    }

    @TestCase(undefined, true)
    @TestCase(null, true)
    @TestCase([], false)
    @TestCase({}, false)
    @Test('isVoid(obj: any) should check if a variable is null or undefined')
    public isVoid1<T>(object: T, expected: boolean) {
        const actual = isVoid(object);

        Expect(actual).toBe(expected);
    }
}
