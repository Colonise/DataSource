// https://beta-rxjsdocs.firebaseapp.com/api/index/NextObserver
export interface NextObserver<T> {
    closed?: boolean;
    next(value: T): void;
    // tslint:disable-next-line:no-any
    error?(err: any): void;
    complete?(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/ErrorObserver
export interface ErrorObserver<T> {
    closed?: boolean;
    next?(value: T): void;
    // tslint:disable-next-line:no-any
    error(err: any): void;
    complete?(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/CompletionObserver
export interface CompletionObserver<T> {
    closed?: boolean;
    next?(value: T): void;
    // tslint:disable-next-line:no-any
    error?(err: any): void;
    complete(): void;
}

// https://beta-rxjsdocs.firebaseapp.com/api/index/PartialObserver
export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;

// https://beta-rxjsdocs.firebaseapp.com/api/index/Unsubscribable
export interface Unsubscribable {
    unsubscribe(): void;
}
