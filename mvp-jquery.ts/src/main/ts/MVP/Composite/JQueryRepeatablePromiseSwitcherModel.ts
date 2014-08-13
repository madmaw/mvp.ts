module TS.IJQuery.MVP.Composite {

    export class JQueryRepeatablePromiseSwitcherModel extends JQueryOneShotPromiseSwitcherModel {

        private _importData: any;
        private _importCallback: TS.MVP.IModelImportStateCallback;

        constructor(
            loadingPresenter: TS.MVP.IPresenterWithModel<TS.MVP.Loading.ILoadingModel>,
            private _retryFunction: (data:any, callback:TS.MVP.IModelImportStateCallback, beforePromise: JQueryPromise<any>, additionalPromises:JQueryPromise<any>[], afterFunction: ()=>JQueryPromise<any>) => { maxProgress: number; promise: JQueryPromise<TS.MVP.IPresenter>; },
            failurePresenter: TS.MVP.IPresenterWithModel<TS.MVP.Error.IErrorModel>,
            errorMarshaler: (arguments:IArguments) => TS.MVP.Error.ErrorModelState,
            private _defaultStateDescription?: any
        ) {
            super(loadingPresenter, failurePresenter, errorMarshaler);
        }

        public retry(beforePromise?: JQueryPromise<any>, additionalPromises?:JQueryPromise<any>[], afterFunction?:()=>JQueryPromise<any>) {
            var promiseDescription = this._retryFunction(this._importData, this._importCallback, beforePromise, additionalPromises, afterFunction);

            this.setPromise(
                promiseDescription.promise.then((presenter: TS.MVP.IPresenter)=>{
                    // let's assume the import callback has finished
                    this._importCallback = undefined;
                    this._importData = undefined;
                    return presenter;
                }),
                promiseDescription.maxProgress
            );
        }

        public _getErrorModel(errorState: TS.MVP.Error.ErrorModelState) {
            // TODO make a retrying error model
            return super._getErrorModel(errorState);
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
                result = this._defaultStateDescription;
            }
            return result;
        }

    }

} 