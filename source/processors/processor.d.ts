import { ComplexProcessor } from './complex';
import { QueueProcessor } from './queue';
import { SimpleProcessor } from './simple';

/**
 * A data processor.
 */
export type Processor<TData> = QueueProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
