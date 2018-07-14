import { DataSourceProcessor } from './processors';
import { DataSourceSubscription, NextObserver, PartialObserver, Subscribable, Unsubscribable } from './rx-subscribable';

/**
 * A class to handle temporal changes in data while not mutating the original data itself.
 */
export class DataSource<TData> implements Subscribable<TData> {
    protected processedData: TData;
    protected processors: DataSourceProcessor<TData>[] = [];
    protected preprocessors: DataSourceProcessor<TData>[] = [];
    protected subscriptions: DataSourceSubscription<TData>[] = [];

    /**
     * Creates a new DataSource with the supplied data.
     *
     * @param data The data.
     * @param preprocessors The preprocessors that have precedence over the processors.
     */
    public constructor(protected data: TData) {
        this.processedData = this.cloneData();
    }

    /**
     * Gets the current processed version of the data.
     */
    public get(): TData {
        return this.processedData;
    }

    /**
     * Sets the data.
     *
     * @param data The new data to replace the current data with.
     */
    public set(data: TData) {
        this.data = data;

        return this.processData();
    }

    /**
     * Subscribes to change events of the data after processing.
     *
     * @param observer The data observer.
     */
    public subscribe(observer: PartialObserver<TData>): Unsubscribable;
    /**
     * Subscribes to change events of the data after processing.
     *
     * @param next The function that will receive updates of newly processed data.
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

        const subscriptionHolder = <{ subscription: DataSourceSubscription<TData> }>{};

        subscriptionHolder.subscription = new DataSourceSubscription(observer, () =>
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

    /**
     * Appends the supplied processor to manipulate the data before it is output.
     *
     * @param processor The data processor to add.
     */
    public addProcessor(processor: DataSourceProcessor<TData>) {
        if (this.processors.indexOf(processor) === -1) {
            this.processors.push(processor);

            return this.processData();
        }

        return this.processedData;
    }

    /**
     * Removes the supplied processor from manipulating the data output.
     *
     * @param processor The data processor to remove.
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

        return this.processors.length < originalProcessors.length ? this.processData() : this.processedData;
    }

    protected createNoopProcessor(): DataSourceProcessor<TData> {
        return data => data;
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
        let clonedData = this.cloneData();

        this.preprocessors.forEach(preprocessors => {
            clonedData = preprocessors(clonedData);
        });

        this.processors.forEach(processor => {
            clonedData = processor(clonedData);
        });

        this.processedData = clonedData;

        this.subscriptions.forEach(subscription => {
            if (subscription.observer.next) {
                subscription.observer.next(this.processedData);
            }
        });

        return this.processedData;
    }
}
