///<reference path="IPresenter.ts"/>

module TS.MVP {

    export interface IPresenterWithModel<ModelType extends IModel> extends IPresenter {

        setModel(model:ModelType): void;
    }

}