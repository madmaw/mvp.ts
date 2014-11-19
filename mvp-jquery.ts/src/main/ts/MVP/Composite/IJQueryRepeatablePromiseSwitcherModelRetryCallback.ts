module TS.IJQuery.MVP.Composite {
    export interface IJQueryRepeatablePromiseSwitcherModelRetryCallback {
        (data:any, callback:TS.MVP.IModelImportStateCallback, beforePromise: JQueryPromise<any>, additionalPromises:JQueryPromise<any>[], afterFunction: ()=>JQueryPromise<any>): { maxProgress: number; promiseFactory: ()=>JQueryPromise<TS.MVP.IPresenter>; };
    }

}