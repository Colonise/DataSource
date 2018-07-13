declare type TypedArguments<TValue> = {
    [key: number]: TValue;
    length: number;
    callee: Function;
}
