module TS.MVP.Form {
    export interface IListFormModel<ValueType, SourceValueType> extends IFormModel<ValueType, SourceValueType>, TS.MVP.List.IListPresenterModel {
        requestAddRow(): void;

        requestRemoveRow(index:number): void;
    }
}