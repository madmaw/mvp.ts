
module TS.MVP.Composite {

    export var compositePresenterModelEventTypePresentersChanged = "presentersChanged";

    export interface ICompositePresenterModel extends IModel {
        getPresenters(): IPresenter[];
    }
}