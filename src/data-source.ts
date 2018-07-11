import { NextObserver, PartialObserver, Subscribable, Subscription, Unsubscribable } from './rx-subscribable';

export type DataSourceProcessor<TData> = (data: TData) => TData;

/**
 * TODO
 */
export class DataSource<TData> implements Subscribable<TData> {
    protected data: TData;
    protected processedData: TData;
    protected processors: DataSourceProcessor<TData>[] = [];
    protected subscriptions: Subscription<TData>[] = [];

    /**
     * TODO
     *
     * @param data TODO
     */
    public constructor(data: TData) {
        this.data = data;

        this.processedData = this.cloneData();
    }

    /**
     * Gets a processed version of the data
     */
    public get(): TData {
        return this.processedData;
    }

    /**
     * Sets the current data
     *
     * @param data The new data to replace the current data with
     */
    public set(data: TData) {
        this.data = data;

        return this.processData();
    }

    /**
     * Subscribes to change events of the data after processing.
     *
     * @param observer TODO
     */
    public subscribe(observer: PartialObserver<TData>): Unsubscribable;
    /**
     * Subscribes to change events of the data after processing.
     *
     * @param next TODO
     * @param error TODO
     * @param complete TODO
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
            subscriptionHolder.subscription.observer.next(this.processedData);
        }

        this.subscriptions.push(subscriptionHolder.subscription);

        return subscriptionHolder.subscription;
    }

    /**
     * Unsubscribes the supplied subscription from change events of the data after processing.
     *
     * @param subscription TODO
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

    /**
     * TODO
     *
     * @param processor TODO
     */
    public addProcessor(processor: DataSourceProcessor<TData>) {
        if (this.processors.indexOf(processor) === -1) {
            this.processors.push(processor);
        }

        return this.processData();
    }

    /**
     * TODO
     *
     * @param processor TODO
     */
    public removeProcessor(processor: DataSourceProcessor<TData>): TData;
    public removeProcessor(oldProcessor: DataSourceProcessor<TData>) {
        const originalProcessors = this.processors;
        this.processors = [];

        originalProcessors.forEach(processor => {
            if (processor !== oldProcessor) {
                this.processors.push(processor);
            }
        });

        return this.processors !== originalProcessors ? this.processData() : this.processedData;
    }

    protected cloneData(): TData {
        if (typeof this.data !== 'object' || this.data === null) {
            return this.data;
        } else if (Array.isArray(this.data)) {
            return <any>this.data.slice();
        } else {
            return { ...(<any>this.data) };
        }
    }

    protected processData() {
        let data = this.cloneData();

        this.processors.forEach(processor => {
            data = processor(data);
        });

        this.processedData = data;

        this.subscriptions.forEach(subscription => {
            if (subscription.observer.next) {
                subscription.observer.next(this.processedData);
            }
        });

        return this.processedData;
    }
}
