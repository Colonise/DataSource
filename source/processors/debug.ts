import { ComplexProcessor } from './complex';

export interface Loggers<TData> {
    before(debugProcessor: DebugProcessor<TData>, input: TData): void;
    after(debugProcessor: DebugProcessor<TData>, input: TData, output: TData): void;
}

export class DebugProcessor<TData> extends ComplexProcessor<TData> {
    public constructor(
        public readonly name: string,
        public readonly wrapperProcessor: ComplexProcessor<TData>,
        public readonly loggers: Loggers<TData> = {
            before(debugProcessor, input) {
                // eslint-disable-next-line no-console
                console.debug(`DebugProcess(before): ${debugProcessor.name}`, input);
            },
            after(debugProcessor, _input, output) {
                // eslint-disable-next-line no-console
                console.debug(`DebugProcess(after): ${debugProcessor.name}`, output);
            }
        }
    ) {
        super(wrapperProcessor.value);
    }

    protected processor(input: TData): TData {
        this.loggers.before(this, input);

        const output = this.wrapperProcessor.process(input);

        this.loggers.after(this, input, output);

        return output;
    }
}
