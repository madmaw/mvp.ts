module TS.MVP.Form {
    export var FORM_FIELD_FOCUS_MODEL_CHANGE = "FormFieldFocusModelChange";

    export interface IFormModel<ValueType> extends IModel {

        getErrors(): string[];

        setValue(value: ValueType): void;

        requestComplete(): void;

        // NOTE: the below methods are only used internally!
        setError(error: IFormError, forceShow?:boolean);

        clear(): void;

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean);

        getValue(into?: ValueType): ValueType;

        isModified(): boolean;

        setCompletionListener(completionListener:()=>void):void;

        // fires a special focus event
        requestFocus();
    }
}