// Module
module TS.IJQuery.MVP.HB.Example.Toolbar {

    export class ToolbarDecoratorModel extends TS.MVP.Composite.AbstractCompositePresenterModel implements TS.MVP.Composite.IKeyedCompositePresenterModel {

        constructor(private _toolbarPresenter: TS.MVP.IPresenter, private _toolbarPresenterKey: string, private _otherPresenters: TS.MVP.IPresenter[], private _otherPresenterKey: string) {
            super();
        }

        public getPresenterKey(presenter: TS.MVP.IPresenter): string {
            var result: string;
            if (presenter == this._toolbarPresenter) {
                result = this._toolbarPresenterKey;
            } else {
                result = this._otherPresenterKey;
            }
            return result;
        }

        public _getDescribedPresenters(): TS.MVP.IPresenter[]{
            // assume the toolbar is stateless
            return this._otherPresenters;
        }

        public getPresenters(): TS.MVP.IPresenter[]{
            var result = [this._toolbarPresenter];
            arrayPushAll(result, this._otherPresenters);
            return result;
        }
    }

}
