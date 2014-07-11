module TS.MVP.Composite.Stack {

    export class AbstractStackPresenterPopModelStateChangeOperation<PresenterType extends TS.MVP.IPresenter> implements IModelStateChangeOperation {
        constructor(private _model: AbstractStackPresenterModel<PresenterType>, private _entry: AbstractStackPresenterModelEntry<PresenterType>) {
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

        public activate() {
            // do nothing (probably)
        }
    }

    

} 