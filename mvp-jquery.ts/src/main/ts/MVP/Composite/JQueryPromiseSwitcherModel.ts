module TS.JQuery.MVP.Composite {

    export class JQueryPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        private _currentPresenter: TS.MVP.IPresenter;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _retryFunction: () => { maxProgress: number; promise: JQueryPromise<TS.MVP.IPresenter>; },
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

        public retry() {
            var promiseDescription = this._retryFunction();
            var promise = promiseDescription.promise;
            var maxProgress = promiseDescription.maxProgress;
            // initialize the loading model
            var loadingModel = new TS.JQuery.MVP.Loading.JQueryPromiseLoadingModel(promise, maxProgress);
            this._loadingPresenter.setModel(loadingModel);
            this._currentPresenter = this._loadingPresenter;
            this._fireModelChangeEvent();
            promise.done((presenter: TS.MVP.IPresenter) => {
                this._currentPresenter = presenter;
                this._fireModelChangeEvent();
            }).fail(() => {
                // TODO make this a retrying error model
                var args = arguments;
                var errorState = this._errorMarshaler(args);
                var errorModel = new TS.MVP.Stateful.ImmutableStatefulModel(errorState);
                this._failurePresenter.setModel(errorModel);
                this._currentPresenter = this._failurePresenter;
                this._fireModelChangeEvent();
            });
        }


    }

} 