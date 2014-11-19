module TS.MVP.Form {
    export interface IListFormModel<ValueType, SourceValueType> extends IFormModel<ValueType, SourceValueType>, TS.MVP.List.IListPresenterModel {
        requestAddRow(type: string): void;

        requestRemoveRow(index:number): void;
    }
}