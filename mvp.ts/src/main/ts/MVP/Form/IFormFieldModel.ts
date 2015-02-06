module TS.MVP.Form {

    export interface IFormFieldModel<ValueType, SourceValueType> extends IFormModel<ValueType, SourceValueType> {

        // gets the default value (not pre-populated)
        getDefaultValue(): ValueType;

    }

}