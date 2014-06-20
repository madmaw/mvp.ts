module TS.JQuery.MVP.Composite {

    export class JQueryPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        private _currentPresenter: TS.MVP.IPresenter;

        private _successPresenterAvailable: boolean;
        private _importData: any;
        private _importCallback: TS.MVP.IModelImportStateCallback;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _retryFunction: (data:any, callback:TS.MVP.IModelImportStateCallback) => { maxProgress: number; promise: JQueryPromise<TS.MVP.IPresenter>; },
            private _errorMarshaler: (arguments:IArguments) => TS.MVP.Error.ErrorModelState
        ) {
            super();
            this._successPresenterAvailable = false;
        }

        public getPresenters(): TS.MVP.IPresenter[]{
            if (this._currentPresenter) {
                return [this._currentPresenter];
            } else {
                return [];
            }
        }

        public retry() {
            this._successPresenterAvailable = false;
            var promiseDescription = this._retryFunction(this._importData, this._importCallback);
            var promise = promiseDescription.promise;
            var maxProgress = promiseDescription.maxProgress;
            // initialize the loading model
            var loadingModel = new TS.JQuery.MVP.Loading.JQueryPromiseLoadingModel(promise, maxProgress);
            this._loadingPresenter.setModel(loadingModel);

            this._currentPresenter = this._loadingPresenter;
            this._updateListeningForStateDescriptionChanges();
            this._fireModelChangeEvent();
            promise.done((presenter: TS.MVP.IPresenter) => {
                // let's assume the input callback has finished
                this._importCallback = null;
                this._successPresenterAvailable = true;

                this._currentPresenter = presenter;
                this._updateListeningForStateDescriptionChanges();
                this._fireModelChangeEvent();
            }).fail(() => {
                // TODO make this a retrying error model
                var args = arguments;
                var errorState = this._errorMarshaler(args);
                var errorModel = new TS.MVP.Stateful.ImmutableStatefulModel(errorState);
                this._failurePresenter.setModel(errorModel);
                this._currentPresenter = this._failurePresenter;
                this._updateListeningForStateDescriptionChanges();
                this._fireModelChangeEvent();
            });
        }

        public importState(description: any, importCompletionCallback: TS.MVP.IModelImportStateCallback): void {
            if (this._successPresenterAvailable) {
                this._currentPresenter.getModel().importState(description, importCompletionCallback);
            } else {
                this._importData = description;
                this._importCallback = importCompletionCallback;
            }
        }

        public exportState() {
            var result;
            if (this._successPresenterAvailable) {
                result = this._currentPresenter.getModel().exportState();
            } else {
                result = null;
            }
            return result;
        }

    }

} 