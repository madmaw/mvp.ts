///<reference path="ICompositePresenterModel.ts"/>

// Module
module TS.MVP.Composite {

    // Class
    export interface IKeyedCompositePresenterModel extends TS.MVP.Composite.ICompositePresenterModel {
        getPresenterKey(presenter: IPresenter): string;
    }

}
