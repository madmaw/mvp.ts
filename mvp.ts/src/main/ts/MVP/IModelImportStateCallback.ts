module TS.MVP {

    export interface IModelImportStateCallback {
        (stateChanges: ModelStateChangeEvent[]):void;
    }

} 