import { CachedProcessor } from './cached-processor';
import { ComplexProcessor } from './complex-processor';
import { SimpleProcessor } from './simple-processor';

export type Processor<TData> = CachedProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
