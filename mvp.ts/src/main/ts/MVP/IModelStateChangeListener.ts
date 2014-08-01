module TS.MVP {

    export interface IModelStateChangeListener {

        (source: IModel, change: ModelStateChangeEvent, firedModels?:IModel[]): void
    }

} 