module TS.IJQuery.MVP.Loading {

    export class JQueryPromiseLoadingModel<T> extends TS.MVP.AbstractModel implements TS.MVP.Loading.ILoadingModel {

        private _progress: number;

        constructor(private _promise:JQueryPromise<T>, private _maxProgress:number) {
            super();
            this._progress = 0;
            _promise.progress((progress:number)=> {
                this._progress = progress;
                this._fireModelChangeEvent(null, true);
            });
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