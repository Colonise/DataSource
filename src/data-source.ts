export class DataSource<TData> {
    protected data: TData;
    protected renderedData: TData;

    constructor(data: TData) {
        this.data = data;

        this.renderedData = this._cloneData();
    }

    public get(): TData {
        return this.renderedData;
    }

    public set(data: TData) {
        this.data = data;

        this._renderData();
    }

    protected _renderData() {
        this.renderedData = this._cloneData();
    }

    protected _cloneData(): TData {
        if (typeof this.data !== 'object' || this.data === null) {
            return this.data;
        } else if (Array.isArray(this.data)) {
            return <any>this.data.slice();
        } else {
            return { ...(<any>this.data) };
        }
    }
}
