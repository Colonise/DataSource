import { ComplexProcessor } from './complex';
import { QueueProcessor } from './queue';
import { SimpleProcessor } from './simple';

/**
 * TODO
 */
export type Processor<TData> = QueueProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
