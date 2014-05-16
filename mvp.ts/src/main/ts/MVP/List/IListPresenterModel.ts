///<reference path="../IModel.ts"/>

// Module
module TS.MVP.List {

    // Class
    export interface IListPresenterModel extends IModel {

        getPresenter(index: number, reuseController: IPresenter): IPresenter;

        getPresenterType(index: number): string;

        getPresenterCount(): number;

    }

}