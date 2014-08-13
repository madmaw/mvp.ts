module TS.IJQuery.MVP.Composite {

    export class JQueryOneShotPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        public _currentPresenter: TS.MVP.IPresenter;

        public _successPresenter: TS.MVP.IPresenter;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter?: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _errorMarshaler?: (arguments:IArguments) => TS.MVP.Error.ErrorModelState
        ) {
            super();
        }

        public setPromise(promise: JQueryPromise<TS.MVP.IPresenter>, maxProgress: number) {
            this._successPresenter = undefined;
            // initialize the loading model
            var loadingModel = new TS.IJQuery.MVP.Loading.JQueryPromiseLoadingModel(promise, maxProgress);
            this._loadingPresenter.setModel(loadingModel);

            this._setCurrentPresenter(this._loadingPresenter);
            promise.then((presenter: TS.MVP.IPresenter) => {
                this._successPresenter = presenter;

                this._setCurrentPresenter(presenter)
            });
            // only handle failures if we actually have a failure presenter (otherwise, infinite loading!)
            if( this._failurePresenter ) {
                promise.fail(() => {
                    var args = arguments;
                    var errorState = this._errorMarshaler(args);
                    var errorModel = this._getErrorModel(errorState);
                    this._failurePresenter.setModel(errorModel);
                    this._setCurrentPresenter(this._failurePresenter);
                });
            }

        }

        public _getErrorModel(errorState: TS.MVP.Error.ErrorModelState) {
            return new TS.MVP.Stateful.ImmutableStatefulModel(errorState)
        }

        public getPresenters(): TS.MVP.IPresenter[]{
            if (this._currentPresenter) {
                return [this._currentPresenter];
            } else {
                return [];
            }
        }

        public _setCurrentPresenter(currentPresenter: TS.MVP.IPresenter) {
            this._currentPresenter = currentPresenter;
            this._updateListeningForStateDescriptionChanges();
            this._fireModelChangeEvent();
        }
    }

}