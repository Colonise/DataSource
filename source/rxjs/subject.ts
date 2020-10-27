import { clone, isFunction } from '@colonise/utilities';
import { Subscription } from './subscription';
import type {
    PartialObserver,
    Subscribable,
    Unsubscribable
} from 'rxjs';

/**
 * The public API of a Subject.
 */
export interface SubjectApi<TValue> {

    /**
     * The current value.
     */
    value: TValue;

    /**
     * Returns the current value.
     */
    getValue(): TValue;

    /**
     * Subscribes to change events of the dat.
     *
     * @param observer The data observer.
     */
    subscribe(observer: PartialObserver<TValue>): Unsubscribable;

    /**
     * Subscribes to change events of the data.
     *
     * @param next The function that will receive updates of new data.
     * @param error The function that will receive the error if any occurs.
     * @param complete The functions that will be called when the data will no longer change.
     */
    subscribe(
        next: ((value: TValue) => void) | undefined,

        error?: (error: unknown) => void,
        complete?: () => void
    ): Unsubscribable;

    /**
     * Unsubscribes the supplied subscription from change events of the data.
     *
     * @param subscription The subscription that will be unsubscribed.
     */
    unsubscribe(subscription: Unsubscribable): void;
}

/**
 * A Subject like Subscribable.
 */
export abstract class Subject<TData> implements Subscribable<TData>, SubjectApi<TData> {
    public get original(): TData  {
        return this.lastInput;
    }

    /**
     * The current value.
     */
    public get value(): TData {
        return this.getValue();
    }

    protected lastInput: TData;
    protected lastOutput: TData;
    protected subscriptions: Subscription<TData>[] = [];

    /**
     * Creates a new Subject.
     *
     * @param lastOutput The current output value of the subject.
     */
    public constructor (lastInput: TData, lastOutput: TData) {
        this.lastInput = lastInput;
        this.lastOutput = lastOutput;
    }

    /**
     * Returns the current value.
     */
    public getValue(): TData {
        return clone(this.lastOutput);
    }

    public subscribe(observer?: PartialObserver<TData>): Unsubscribable;

    /** @deprecated Use an observer instead of a complete callback */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;

    /** @deprecated Use an observer instead of an error callback */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public subscribe(next: null | undefined, error: (error: unknown) => void, complete?: () => void): Unsubscribable;

    /** @deprecated Use an observer instead of a complete callback */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public subscribe(next: (value: TData) => void, error: null | undefined, complete: () => void): Unsubscribable;
    public subscribe(next?: (value: TData) => void, error?: (error: unknown) => void, complete?: () => void): Unsubscribable;
    public subscribe(
        // eslint-disable-next-line @typescript-eslint/ban-types
        observerOrNext?: PartialObserver<TData> | ((value: TData) => void) | null | undefined
    ): Unsubscribable {
        const observer: PartialObserver<TData> = isFunction(observerOrNext)
            ? { next: observerOrNext }
            : observerOrNext ?? { next: () => { } };

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const subscriptionHolder = <{ subscription: Subscription<TData>; }>{};

        subscriptionHolder.subscription = new Subscription(observer, () => {
            this.unsubscribe(subscriptionHolder.subscription);
        });

        // Call the observer's next once
        if (isFunction(subscriptionHolder.subscription.observer.next)) {
            subscriptionHolder.subscription.observer.next(this.lastOutput);
        }

        this.subscriptions.push(subscriptionHolder.subscription);

        return subscriptionHolder.subscription;
    }

    /**
     * Unsubscribes the supplied subscription from change events of the data.
     *
     * @param subscription The subscription that will be unsubscribed.
     */
    public unsubscribe(subscription: Unsubscribable): void;
    public unsubscribe(oldSubscription: Unsubscribable): void {
        const originalSubscriptions = this.subscriptions;
        this.subscriptions = [];

        originalSubscriptions.forEach(subscription => {
            if (subscription !== oldSubscription) {
                this.subscriptions.push(subscription);
            }
        });
    }

    protected next(value: TData): TData {
        this.lastOutput = value;

        this.subscriptions.forEach(subscription => {
            if (subscription.observer.next) {
                subscription.observer.next(this.lastOutput);
            }
        });

        return this.lastOutput;
    }
}
