module TS.IJQuery.MVP.Composite {

    export class JQueryOneShotPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        public _currentPresenter: TS.MVP.IPresenter;

        public _successPresenter: TS.MVP.IPresenter;

        public _importing: boolean;
        public _importData: any;
        public _importCallback: TS.MVP.IModelImportStateCallback;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter?: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _errorMarshaler?: (arguments:IArguments) => TS.MVP.Error.ErrorModelState,
            public _defaultStateDescription?: any
        ) {
            super();
            // assume we want to import it on a refresh, in lieu of anything else being available
            this._importData = _defaultStateDescription;
        }

        public setPromise(promise: JQueryPromise<TS.MVP.IPresenter>, maxProgress: number) {
            this._successPresenter = undefined;
            // initialize the loading model
            var loadingModel = new TS.IJQuery.MVP.Loading.JQueryPromiseLoadingModel(promise, maxProgress);
            this._loadingPresenter.setModel(loadingModel);

            this._setCurrentPresenter(this._loadingPresenter);
            promise.then((presenter: TS.MVP.IPresenter) => {
                this._successPresenter = presenter;
                if( this._importing ) {
                    this._importing = false;
                    presenter.getModel().importState(this._importData, this._importCallback);
                }
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

        public importState(description: any, importCompletionCallback: TS.MVP.IModelImportStateCallback): void {
            if (this._successPresenter) {
                this._successPresenter.getModel().importState(description, importCompletionCallback);
                this._importing = false;
            } else {
                this._importData = description;
                this._importCallback = importCompletionCallback;
                this._importing = true;
            }
        }

        public exportState() {
            var result;
            if (this._successPresenter) {
                result = this._successPresenter.getModel().exportState();
            } else {
                result = this._defaultStateDescription;
            }
            return result;
        }

    }

}