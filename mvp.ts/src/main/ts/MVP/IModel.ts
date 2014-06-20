module TS.MVP {
    export interface IModel {

        addChangeListener(listener: IModelChangeListener): void;

        removeChangeListener(listener: IModelChangeListener ): void;

        addStateChangeListener(listener: IModelStateChangeListener ): void;

        removeStateChangeListener(listener: IModelStateChangeListener ): void;

        exportState(models?:IModel[]):any;

        importState(description: any, importCompletionCallback: IModelImportStateCallback): void;
    }
}