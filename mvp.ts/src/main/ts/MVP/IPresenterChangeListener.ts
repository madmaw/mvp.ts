module TS.MVP {

    export interface IPresenterChangeListener {
        (source: IPresenter, changeEvent: PresenterChangeEvent): void;
    }

} 