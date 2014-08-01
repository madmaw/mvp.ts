module TS.MVP {

    export interface IModelChangeListener {

        (source: IModel, change: ModelChangeEvent, firedModels?:IModel[]): void;

    }

}