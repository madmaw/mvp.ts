module TS.IJQuery.MVP.Loading {

    export class JQueryPromiseLoadingModel<T> extends TS.MVP.AbstractModel implements TS.MVP.Loading.ILoadingModel {

        private _progress: number;
        private _promiseCount: number;
        private _promiseCompletionCount: number;
        private _completionFunction: (t:T) => T;
        private _promise: JQueryPromise<T>;
        private _maxProgress: number;

        constructor() {
            super();
            this._progress = 0;
            this._maxProgress = 0;
            this._promiseCount = 0;
            this._promiseCompletionCount = 0;
            this._promiseCompletionCount = 0;
            this._completionFunction = (t:T) => {
                this._promiseCompletionCount++;
                return t;
            };
        }

        public appendPromise(promiseFactory: ()=>JQueryPromise<T>, maxProgress: number): JQueryPromise<T> {
            var oldMaxProgress = this._maxProgress;
            this._maxProgress += maxProgress;
            this._promiseCount++;
            var progressFunction = (progress:number) => {
                this._progress = progress + oldMaxProgress;
                this._fireModelChangeEvent(null, true);
            };
            if( this._promise ) {
                var result = new $.Deferred();
                this._promise = this._promise.then((t:T) => {
                    return <any>promiseFactory().progress(progressFunction)
                    .then(this._completionFunction)
                    .then(function(t:T) {
                        result.resolve(t);
                    })
                    .fail(function(e:any) {
                        result.reject(e);
                    });
                });
                return <any>result.promise;
            } else {
                this._promise = promiseFactory().progress(progressFunction)
                .then(this._completionFunction);
                return this._promise;
            }
        }

        public isCompleted() {
            return this._promiseCompletionCount == this._promiseCount;
        }

        // causes infinite loop? think due to repeatedly adding listener
//        public _startedListening():void {
//            super._startedListening();
//            this._promise.progress((progress:number)=> {
//                this._progress = progress;
//                this._fireModelChangeEvent(null, true);
//            });
//        }

        public getState(): TS.MVP.Loading.LoadingModelState {

            return new TS.MVP.Loading.LoadingModelState(this._progress, this._maxProgress, null);

        }

    }

} 