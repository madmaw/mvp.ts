module TS.IJQuery.MVP.List {

    export class AbstractListJQueryPresenterItem {
        constructor(private _presenter: TS.IJQuery.MVP.IJQueryPresenter, private _presenterType: string, private _containerView?: TS.IJQuery.MVP.IJQueryView) {
        }

        public getPresenter(): TS.IJQuery.MVP.IJQueryPresenter {
            return this._presenter;
        }

        public getPresenterType(): string {
            return this._presenterType;
        }

        public getContainerView(): TS.IJQuery.MVP.IJQueryView {
            return this._containerView;
        }
    }

} 