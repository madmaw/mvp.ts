module TS.MVP.Form {
    export var FORM_FIELD_FOCUS_MODEL_CHANGE = "FormFieldFocusModelChange";

    export interface IFormModel<ValueType, SourceValueType> extends IModel {

        getErrors(): string[];

        getValue(): ValueType;

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean): void;

        requestComplete(): void;

        // NOTE: the below methods are only used internally!
        setSourceError(error: IFormError, forceShow?:boolean);

        clear(): void;

        getSourceValue(): SourceValueType;

        setSourceValue(sourceValue: SourceValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean);

        isModified(): boolean;

        setCompletionListener(completionListener:()=>void):void;

        // fires a special focus event
        requestFocus();

    }
}