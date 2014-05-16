module TS.MVP {

    export interface IModelChangeListener {

        (source: IModel, change: ModelChangeEvent): void;

    }

}