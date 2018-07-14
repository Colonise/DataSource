import { ComplexProcessor } from './complex-processor';

/**
 * TODO
 */
export abstract class CachedProcessor<TData> extends ComplexProcessor<TData> {
    protected fresh: boolean = false;
    protected abstract cache: TData;

    /**
     * TODO
     */
    public process(data: TData): TData {
        if (!this.active) {
            return data;
        }

        if (!this.fresh) {
            this.cache = this.processor(data);
            this.fresh = true;
        }

        return this.cache;
    }
}
