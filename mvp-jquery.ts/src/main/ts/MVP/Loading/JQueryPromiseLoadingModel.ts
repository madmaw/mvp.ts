module TS.IJQuery.MVP.Loading {

    export class JQueryPromiseLoadingModel<T> extends TS.MVP.AbstractModel implements TS.MVP.Loading.ILoadingModel {

        private _progress: number;

        constructor(private _promise:JQueryPromise<T>, private _maxProgress:number) {
            super();
            this._progress = 0;
        }

        public getState(): TS.MVP.Loading.LoadingModelState {

            return new TS.MVP.Loading.LoadingModelState(this._progress, this._maxProgress, null);

        }

    }

} 