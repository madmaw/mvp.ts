module TS.MVP.Form {
    export interface IListFormModel<ValueType> extends IFormModel<ValueType>, TS.MVP.List.IListPresenterModel {
        requestAddRow(): void;

        requestRemoveRow(index:number): void;
    }
}