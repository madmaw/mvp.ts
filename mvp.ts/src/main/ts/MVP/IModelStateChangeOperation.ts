// Module
module TS.MVP {

    // Class
    export interface IModelStateChangeOperation {

        undo(): void;

        redo(): void;

        // called when the state is returned to via another state's undo operation
        activate(): void;
    }

}