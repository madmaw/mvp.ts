///<reference path="../IModel.ts"/>

module TS.MVP.Table {
    export interface ITablePresenterModel extends IModel {
        getRowCount(): number;

        getColumnCount(): number;

        getRowHeaderDepth(): number;

        getColumnHeaderDepth(): number;

        getRowHeader(row: number, depth:number): TableHeader;

        getColumnHeader(column: number, depth:number): TableHeader;

        getCell(row: number, column: number): IPresenter;
    }

}