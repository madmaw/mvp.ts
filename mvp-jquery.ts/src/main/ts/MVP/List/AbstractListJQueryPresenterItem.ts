module TS.JQuery.MVP.List {

    export class AbstractListJQueryPresenterItem {
        constructor(private _presenter: TS.JQuery.MVP.IJQueryPresenter, private _presenterType: string, private _containerView?: TS.JQuery.MVP.IJQueryView) {
        }

        public getPresenter(): TS.JQuery.MVP.IJQueryPresenter {
            return this._presenter;
        }

        public getPresenterType(): string {
            return this._presenterType;
        }

        public getContainerView(): TS.JQuery.MVP.IJQueryView {
            return this._containerView;
        }
    }

} 