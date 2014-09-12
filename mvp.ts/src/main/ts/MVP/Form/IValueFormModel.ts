module TS.MVP.Form {
    export interface IValueFormModel<ValueType> extends IFormModel {
        getValue(): ValueType;
    }
}