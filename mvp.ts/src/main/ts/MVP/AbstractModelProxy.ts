module TS.MVP {

    // Class
    export class AbstractModelProxy extends AbstractModel implements IModel {

        private _onChangeListener: IModelChangeListener;
        private _onStateChangeListener: IModelStateChangeListener;

        // Constructor
        constructor(private _model: IModel) {
            super();

            this._onChangeListener = (source: IModel, event: ModelChangeEvent) => {
                this._fireModelChangeEvent(event, true);
            };

            this._onStateChangeListener = (source: IModel, event: ModelStateChangeEvent) => {
                this._fireStateChangeEvent(source, event);
            };
        }

        public _startedListening() {
            this._model.addChangeListener(this._onChangeListener);
        }

        public _stoppedListening() {
            this._model.removeChangeListener(this._onChangeListener);
        }

        public _startedListeningForStateDescriptionChanges() {
            this._model.addStateChangeListener(this._onStateChangeListener);
        }

        public _stoppedListeningForStateDescriptionChanges() {
            this._model.removeStateChangeListener(this._onStateChangeListener);
        }

        public exportState(models?: IModel[]): any {
            this._checkModels(models);
            return this._model.exportState(models);
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback) {
            this._model.importState(description, importCompletionCallback);
        }

    }

}
