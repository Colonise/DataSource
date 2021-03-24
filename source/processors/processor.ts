import type { ComplexProcessor } from './complex-processor';
import type { QueueProcessor } from './queue-processor';
import type { SimpleProcessor } from './simple-processor';

/**
 * A data processor.
 */
export type Processor<TData> = QueueProcessor<TData> | ComplexProcessor<TData> | SimpleProcessor<TData>;
