module TS.MVP.Form {

    export interface IFormModel extends IModel {

        getErrors(): string[];

        // NOTE: these are only used internally!
        setError(error: any);

        clearError(): void;

        setValue(value: any, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean);

        getValue(into?: any): any;

    }
}