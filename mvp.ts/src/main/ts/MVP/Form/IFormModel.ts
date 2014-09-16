module TS.MVP.Form {

    export interface IFormModel<ValueType> extends IModel {

        getErrors(): string[];

        setValue(value: ValueType): void;

        // NOTE: the below methods are only used internally!
        setError(error: IFormError, forceShow?:boolean);

        clear(): void;

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean);

        getValue(into?: ValueType): ValueType;

        isModified(): boolean;

    }
}