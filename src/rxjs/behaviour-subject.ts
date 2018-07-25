import { NextObserver, PartialObserver, Unsubscribable } from './rxjs';
import { Subscription } from './subscription';

/**
 * The public API of a BehaviourSubject.
 */
export interface BehaviourSubjectApi<TData> {
    /**
     * The current value.
     */
    value: TData;
    /**
     * Returns the current value.
     */
    getValue(): TData;
    /**
     * Subscribes to change events of the dat.
     *
     * @param observer The data observer.
     */
    subscribe(observer: PartialObserver<TData>): Unsubscribable;
    /**
     * Subscribes to change events of the data.
     *
     * @param next The function that will receive updates of new data.
     * @param error The function that will receive the error if any occurs.
     * @param complete The functions that will be called when the data will no longer change.
     */
    subscribe(
        next: ((value: TData) => void) | undefined,
        error?: (error: any) => void,
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
 * A Behaviour Subject like Subscribable.
 *
 * Basic implementation from https://beta-rxjsdocs.firebaseapp.com/api/index/Subscribable
 */
export abstract class BehaviourSubject<TData> {
    protected subscriptions: Subscription<TData>[] = [];

    /**
     * The current value.
     */
    get value(): TData {
        return this.getValue();
    }

    /**
     * Creates a new BehaviourSubject.
     *
     * @param lastOutput The current output value of the subject.
     */
    constructor(protected lastOutput: TData) {}

    /**
     * Returns the current value.
     */
    public getValue(): TData {
        return this.lastOutput;
    }

    /**
     * Subscribes to change events of the dat.
     *
     * @param observer The data observer.
     */
    public subscribe(observer: PartialObserver<TData>): Unsubscribable;
    /**
     * Subscribes to change events of the data.
     *
     * @param next The function that will receive updates of new data.
     * @param error The function that will receive the error if any occurs.
     * @param complete The functions that will be called when the data will no longer change.
     */
    public subscribe(
        next: ((value: TData) => void) | undefined,
        error?: (error: any) => void,
        complete?: () => void
    ): Unsubscribable;
    public subscribe(
        observerOrNext: PartialObserver<TData> | ((value: TData) => void) | undefined,
        error?: (error: any) => void,
        complete?: () => void
    ): Unsubscribable {
        const observer =
            typeof observerOrNext === 'object'
                ? observerOrNext
                : <NextObserver<TData>>{
                      next: observerOrNext,
                      error,
                      complete
                  };

        const subscriptionHolder = <{ subscription: Subscription<TData> }>{};

        subscriptionHolder.subscription = new Subscription(observer, () =>
            this.unsubscribe(subscriptionHolder.subscription)
        );

        // Call the observer's next once
        if (subscriptionHolder.subscription.observer.next) {
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
    public unsubscribe(oldSubscription: Unsubscribable) {
        const originalSubscriptions = this.subscriptions;
        this.subscriptions = [];

        originalSubscriptions.forEach(subscription => {
            if (subscription !== oldSubscription) {
                this.subscriptions.push(subscription);
            }
        });
    }

    protected next(data: TData): TData {
        this.lastOutput = data;

        this.subscriptions.forEach(subscription => {
            if (subscription.observer.next) {
                subscription.observer.next(this.lastOutput);
            }
        });

        return data;
    }
}
