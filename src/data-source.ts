import { NextObserver, PartialObserver, Subscribable, Subscription, Unsubscribable } from './rx-subscribable';

export type DataSourceProcessor<T> = (data: T) => void;

export class DataSource<TData> implements Subscribable<TData> {
    protected data: TData;
    protected processedData: TData;
    protected processors: DataSourceProcessor<TData>[] = [];
    protected subscriptions: Subscription<TData>[] = [];

    constructor(data: TData) {
        this.data = data;

        this.processedData = this.cloneData();
    }

    public get(): TData {
        return this.processedData;
    }

    public set(data: TData) {
        this.data = data;

        this.processData();
    }

    public subscribe(
        observerOrNext?: PartialObserver<TData> | ((value: TData) => void),
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

        return subscriptionHolder.subscription;
    }

    public unsubscribe(oldSubscription: Unsubscribable) {
        const originalSubscriptions = this.subscriptions;
        this.processors = [];

        originalSubscriptions.forEach(subscription => {
            if (subscription !== oldSubscription) {
                this.subscriptions.push(subscription);
            }
        });
    }

    public addProcessor(newProcessor: DataSourceProcessor<TData>) {
        if (this.processors.indexOf(newProcessor) === -1) {
            this.processors.push(newProcessor);
        }

        this.processData();
    }

    public removeProcessor(oldProcessor: DataSourceProcessor<TData>) {
        const originalProcessors = this.processors;
        this.processors = [];

        originalProcessors.forEach(processor => {
            if (processor !== oldProcessor) {
                this.processors.push(processor);
            }
        });

        if (this.processors !== originalProcessors) {
            this.processData();
        }
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
        const newData = this.cloneData();

        this.processors.forEach(processor => {
            processor(newData);
        });

        this.processedData = newData;

        this.subscriptions.forEach(subscription => {
            if (subscription.observer.next) {
                subscription.observer.next(this.processedData);
            }
        });
    }
}
