module TS.MVP.Composite.Stack {

    export class AbstractStackPresenterPopModelStateChange implements IModelStateChange {
        constructor(private _model: AbstractStackPresenterModel, private _entry: AbstractStackPresenterModelEntry) {
        }

        public undo() {
            if (!this._model._contains(this._entry.presenter)) {
                this._model._pushEntry(this._entry, false, true);
            }
        }

        public redo() {
            if (this._model.canPop()) {
                this._model._deStack(this._entry.presenter, false, true);
            }
        }
    }

    

} 