module TS.MVP.Composite {
    export class MappedKeyedCompositePresenterModelStateChangeOperation implements IModelStateChangeOperation {
        public constructor(private _model: MappedKeyedCompositePresenterModel, private _key: string, private _addedPresenter: IPresenter, private _removedPresenter: IPresenter) {

        }

        public undo() {
            // remove the added presenters, add the removed presenters
            this._model.setPresenter(this._key, this._removedPresenter, false, true);
        }

        public redo() {
            // set it
            this._model.setPresenter(this._key, this._addedPresenter, false, true);
        }

        public activate() {
            // do nothing (probably)
        }

    }
}