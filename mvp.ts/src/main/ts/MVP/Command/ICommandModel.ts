///<reference path="../IModel.ts"/>

module TS.MVP.Command {

    export interface ICommandModel extends IModel {
        getCommands(): Command[];
    }

}
