// Module
module TS.MVP {

    // Class
    export interface IModelStateChangeOperation {

        undo(): void;

        redo(): void;
    }

}