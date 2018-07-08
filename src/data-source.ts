export type DataSourceProcessor<T> = (data: T) => void;

export class DataSource<TData> {
    protected data: TData;
    protected processedData: TData;
    protected processors: DataSourceProcessor<TData>[] = [];

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
    }
}
