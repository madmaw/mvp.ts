module TS.IJQuery.MVP.Composite {

    export class JQueryPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        public _currentPresenter: TS.MVP.IPresenter;

        public _successPresenter: TS.MVP.IPresenter;
        private _importData: any;
        private _importCallback: TS.MVP.IModelImportStateCallback;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _retryFunction: (data:any, callback:TS.MVP.IModelImportStateCallback, additionalPromises:JQueryPromise<any>[]) => { maxProgress: number; promise: JQueryPromise<TS.MVP.IPresenter>; },
            private _errorMarshaler: (arguments:IArguments) => TS.MVP.Error.ErrorModelState
        ) {
            super();
        }

        public getPresenters(): TS.MVP.IPresenter[]{
            if (this._currentPresenter) {
                return [this._currentPresenter];
            } else {
                return [];
            }
        }

        public retry(additionalPromises?:JQueryPromise<any>[]) {
            this._successPresenter = undefined;
            var promiseDescription = this._retryFunction(this._importData, this._importCallback, additionalPromises);
            var promise = promiseDescription.promise;
            var maxProgress = promiseDescription.maxProgress;
            // initialize the loading model
            var loadingModel = new TS.IJQuery.MVP.Loading.JQueryPromiseLoadingModel(promise, maxProgress);
            this._loadingPresenter.setModel(loadingModel);

            this._setCurrentPresenter(this._loadingPresenter);
            promise.done((presenter: TS.MVP.IPresenter) => {
                // let's assume the import callback has finished
                this._importCallback = undefined;
                this._importData = undefined;
                this._successPresenter = presenter;

                this._setCurrentPresenter(presenter)
            }).fail(() => {
                // TODO make this a retrying error model
                var args = arguments;
                var errorState = this._errorMarshaler(args);
                var errorModel = new TS.MVP.Stateful.ImmutableStatefulModel(errorState);
                this._failurePresenter.setModel(errorModel);
                this._setCurrentPresenter(this._failurePresenter);
            });
        }

        public _setCurrentPresenter(currentPresenter: TS.MVP.IPresenter) {
            this._currentPresenter = currentPresenter;
            this._updateListeningForStateDescriptionChanges();
            this._fireModelChangeEvent();
        }

        public importState(description: any, importCompletionCallback: TS.MVP.IModelImportStateCallback): void {
            if (this._successPresenter) {
                this._successPresenter.getModel().importState(description, importCompletionCallback);
            } else {
                this._importData = description;
                this._importCallback = importCompletionCallback;
            }
        }

        public exportState() {
            var result;
            if (this._successPresenter) {
                result = this._successPresenter.getModel().exportState();
            } else {
                result = null;
            }
            return result;
        }

    }

} 