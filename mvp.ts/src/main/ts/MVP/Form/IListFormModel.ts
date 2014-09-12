module TS.MVP.Form {
    export interface IListFormModel extends IFormModel, TS.MVP.List.IListPresenterModel {
        requestAddRow(): void;

        requestRemoveRow(index:number): void;
    }
}