export class DataSource<TData> {
    protected _data: TData;
    protected _renderedData: TData;

    constructor(data: TData) {
        this._data = data;

        this._renderedData = this._cloneData();
    }

    public get(): TData {
        return this._renderedData;
    }

    public set(data: TData) {
        this._data = data;

        this._renderData();
    }

    protected _renderData() {
        this._renderedData = this._cloneData();
    }

    protected _cloneData(): TData {
        if (typeof this._data !== 'object' || this._data === null) {
            return this._data;
        } else if (Array.isArray(this._data)) {
            return <any>this._data.slice();
        } else {
            return { ...(<any>this._data) };
        }
    }
}
