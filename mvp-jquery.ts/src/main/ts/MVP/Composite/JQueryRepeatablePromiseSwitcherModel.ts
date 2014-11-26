module TS.IJQuery.MVP.Composite {

    export class JQueryRepeatablePromiseSwitcherModel extends JQueryOneShotPromiseSwitcherModel {

        constructor(
            loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _retryFunction: IJQueryRepeatablePromiseSwitcherModelRetryCallback,
            failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            errorMarshaler: (arguments:IArguments) => TS.MVP.Error.ErrorModelState,
            defaultStateDescription?: any,
            alwaysReturnDefaultStateDescription?:boolean
        ) {
            super(loadingPresenter, failurePresenter, errorMarshaler, defaultStateDescription, alwaysReturnDefaultStateDescription);
        }

        public retry(beforePromise?: JQueryPromise<any>, additionalPromises?:JQueryPromise<any>[], afterFunction?:()=>JQueryPromise<any>) {
            // don't import if we are already
            this._importing = false;
            var promiseDescription = this._retryFunction(this._importData, this._importCallback, beforePromise, additionalPromises, afterFunction);

            var promiseFactory = () => {
                var promise = promiseDescription.promiseFactory();
                return promise.then((presenter: TS.MVP.IPresenter)=>{
                    // let's assume the import callback has finished
                    this._importCallback = undefined;
                    this._importData = this._defaultStateDescription;
                    return presenter;
                });
            };

            this.queuePromise(
                promiseFactory,
                promiseDescription.maxProgress
            );
        }

        public _getErrorModel(errorState: TS.MVP.Error.ErrorModelState) {
            // TODO make a retrying error model
            return super._getErrorModel(errorState);
        }


    }

} 