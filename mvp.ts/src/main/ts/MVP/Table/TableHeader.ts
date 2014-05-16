module TS.MVP.Table {
    export class TableHeader {
        constructor(
            private _presenter: IPresenter,
            private _fromIndex:number,
            private _span:number
        ) {

        }

        public getPresenter(): IPresenter {
            return this._presenter;
        }

        public getFromIndex():number {
            return this._fromIndex;
        }

        public getSpan(): number {
            return this._span;
        }
    }
}