///<reference path="../IModel.ts"/>

// Module
module TS.MVP.List {

    // Class
    export interface IListPresenterModel extends IModel {

        getPresenter(index: number, reusePresenter: IPresenter): IPresenter;

        getPresenterType(index: number): string;

        getPresenterCount(): number;

    }

}