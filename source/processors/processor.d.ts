import type { ComplexProcessor } from './complex';
import type { QueueProcessor } from './queue';
import type { SimpleProcessor } from './simple';

/**
 * A data processor.
 */
export type Processor<TData> = QueueProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
