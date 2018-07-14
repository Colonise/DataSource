/**
 * TODO
 */
export abstract class ComplexProcessor<TData> {
    /**
     * TODO
     */
    public active: boolean = true;
    /**
     * TODO
     */
    public process(data: TData): TData {
        return !this.active ? data : this.processor(data);
    }

    protected abstract processor(data: TData): TData;
}
