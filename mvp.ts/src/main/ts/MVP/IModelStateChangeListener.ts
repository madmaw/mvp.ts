module TS.MVP {

    export interface IModelStateChangeListener {

        (source: IModel, change: IModelStateChange): void
    }

} 