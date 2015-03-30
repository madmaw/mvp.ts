module TS.IJQuery.MVP.Composite {

    export class JQueryOneShotPromiseSwitcherModel extends TS.MVP.Composite.AbstractCompositePresenterModel {

        public _currentPresenter: TS.MVP.IPresenter;

        public _successPresenter: TS.MVP.IPresenter;

        public _importing: boolean;
        public _importData: any;
        public _importCallback: TS.MVP.IModelImportStateCallback;

        private _inProgress: TS.IJQuery.MVP.Loading.JQueryPromiseLoadingModel<TS.MVP.IPresenter>;

        constructor(
            private _loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _failurePresenter?: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            private _errorMarshaler?: (arguments:IArguments) => TS.MVP.Error.ErrorModelState,
            public _defaultStateDescription?: any,
            public _alwaysReturnDefaultStateDescription?: boolean,
            public _overwriteHistory?: boolean
        ) {
            super();
            // assume we want to import it on a refresh, in lieu of anything else being available
            this._importData = _defaultStateDescription;
        }

        public queuePromise(promiseFactory: ()=>JQueryPromise<TS.MVP.IPresenter>, maxProgress: number) {
            if( !this._inProgress ) {
                this._successPresenter = undefined;
                this._inProgress = new TS.IJQuery.MVP.Loading.JQueryPromiseLoadingModel<TS.MVP.IPresenter>();
                this._loadingPresenter.setModel(this._inProgress);
                this._setCurrentPresenter(this._loadingPresenter);
            }
            var promise: JQueryPromise<TS.MVP.IPresenter> = this._inProgress.appendPromise(promiseFactory, maxProgress);

            promise.then((presenter: TS.MVP.IPresenter) => {
                if( this._inProgress && this._inProgress.isCompleted() ) {
                    this._successPresenter = presenter;
                    if( this._importing ) {
                        this._importing = false;
                        presenter.getModel().importState(this._importData, this._importCallback);
                    } else if( this._importCallback ) {
                        // call it back
                        this._importCallback([]);
                        this._importCallback = null;
                    }
                    this._setCurrentPresenter(presenter)
                    this._inProgress = null;
                }
            });
            // only handle failures if we actually have a failure presenter (otherwise, infinite loading!)
            promise.fail(() => {
                if( this._inProgress && this._inProgress.isCompleted() && this._failurePresenter ) {
                    var args = arguments;
                    var errorState = this._errorMarshaler(args);
                    var errorModel = this._getErrorModel(errorState);
                    this._failurePresenter.setModel(errorModel);
                    this._setCurrentPresenter(this._failurePresenter);
                    this._inProgress = null;
                }
            });
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
            this._fireModelChangeEvent(undefined, this._alwaysReturnDefaultStateDescription || this._overwriteHistory);
            if( this._overwriteHistory && !this._alwaysReturnDefaultStateDescription ) {
                //overwrite the history in a separate event
                this._fireStateChangeEvent(this, new TS.MVP.ModelStateChangeEvent(undefined, true));
            }
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
            if (this._successPresenter && !this._alwaysReturnDefaultStateDescription) {
                result = this._successPresenter.getModel().exportState();
            } else {
                result = this._defaultStateDescription;
            }
            return result;
        }

    }

}