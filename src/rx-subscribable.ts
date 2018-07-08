// https://beta-rxjsdocs.firebaseapp.com/api/index/NextObserver
export interface NextObserver<T> {
    closed?: boolean;
    next(value: T): void;
    error?(err: any): void;
    complete?(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/ErrorObserver
export interface ErrorObserver<T> {
    closed?: boolean;
    next?(value: T): void;
    error(err: any): void;
    complete?(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/CompletionObserver
export interface CompletionObserver<T> {
    closed?: boolean;
    next?(value: T): void;
    error?(err: any): void;
    complete(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/PartialObserver
export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;

// https://beta-rxjsdocs.firebaseapp.com/api/index/Unsubscribable
export interface Unsubscribable {
    unsubscribe(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/Subscribable
export interface Subscribable<T> {
    subscribe(
        observerOrNext?: PartialObserver<T> | ((value: T) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Unsubscribable;
}

export class Subscription<T> implements Unsubscribable {
    constructor(public readonly observer: PartialObserver<T>, public readonly unsubscribe: () => void) {}
}
