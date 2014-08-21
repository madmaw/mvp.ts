module TS.IJQuery.MVP.Composite {

    export class JQueryRepeatablePromiseSwitcherModel extends JQueryOneShotPromiseSwitcherModel {

        constructor(
            loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _retryFunction: (data:any, callback:TS.MVP.IModelImportStateCallback, beforePromise: JQueryPromise<any>, additionalPromises:JQueryPromise<any>[], afterFunction: ()=>JQueryPromise<any>) => { maxProgress: number; promise: JQueryPromise<TS.MVP.IPresenter>; },
            failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            errorMarshaler: (arguments:IArguments) => TS.MVP.Error.ErrorModelState,
            defaultStateDescription?: any
        ) {
            super(loadingPresenter, failurePresenter, errorMarshaler, defaultStateDescription);
        }

        public retry(beforePromise?: JQueryPromise<any>, additionalPromises?:JQueryPromise<any>[], afterFunction?:()=>JQueryPromise<any>) {
            // don't import if we are already
            this._importing = false;
            var promiseDescription = this._retryFunction(this._importData, this._importCallback, beforePromise, additionalPromises, afterFunction);


            this.setPromise(
                promiseDescription.promise.then((presenter: TS.MVP.IPresenter)=>{
                    // let's assume the import callback has finished
                    this._importCallback = undefined;
                    this._importData = this._defaultStateDescription;
                    return presenter;
                }),
                promiseDescription.maxProgress
            );
        }

        public _getErrorModel(errorState: TS.MVP.Error.ErrorModelState) {
            // TODO make a retrying error model
            return super._getErrorModel(errorState);
        }


    }

} 