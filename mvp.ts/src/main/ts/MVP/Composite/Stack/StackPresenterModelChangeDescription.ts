///<reference path="../../ModelChangeDescription.ts"/>

// Module
module TS.MVP.Composite.Stack {

    // Class
    export class StackPresenterModelChangeDescription extends ModelChangeDescription {

        // Constructor
        constructor(
            changeType: string,
            private _removedPresenter: IPresenter,
            private _addedPresenter: IPresenter,
            private _silentRemovedPresenters?: IPresenter[],
            private _silentAddedPresenters?: IPresenter[]
        ) {
            super(changeType);
        }

        public getRemovedPresenter(): IPresenter {
            return this._removedPresenter;
        }

        public getAddedPresenter(): IPresenter {
            return this._addedPresenter;
        }

        public getSilentRemovedPresenters(): IPresenter[] {
            return this._silentRemovedPresenters;
        }

        public getSilentAddedPresenters(): IPresenter[]{
            return this._silentAddedPresenters;
        }
    }

}
