module TS.MVP.List {
    export class ListPresenterModelChangeDescription extends ModelChangeDescription {

        public static CHANGE_TYPE_LIST_ITEMS_CHANGE = "listItemsChanged"

        constructor(public removedRows: number[], public appendedRowCount: number, public previousItemCount: number) {
             super(ListPresenterModelChangeDescription.CHANGE_TYPE_LIST_ITEMS_CHANGE);
        }

    }
}