module TS.MVP {

    export interface IModelStateChangeListener {

        (source: IModel, change: ModelStateChangeEvent): void
    }

} 