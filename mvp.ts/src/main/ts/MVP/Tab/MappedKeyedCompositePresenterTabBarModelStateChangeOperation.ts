module TS.MVP.Tab {

    export class MappedKeyedCompositePresenterTabBarModelStateChangeOperation implements IModelStateChangeOperation {

        constructor(private _model: MappedKeyedCompositePresenterTabBarModel, private _fromTabId: string, private _toTabId:string) {

        }

        undo() {
            this._model._setSelectedTabId(this._fromTabId, false, true);
        }

        redo() {
            this._model._setSelectedTabId(this._toTabId, false, true);
        }

        activate() {
            //do nothing
        }
    }

}