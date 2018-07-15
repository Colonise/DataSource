import { ComplexProcessor } from './complex';
import { SimpleProcessor } from './simple';
import { QueueProcessor } from './queue';

/**
 * TODO
 */
export type Processor<TData> = QueueProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
