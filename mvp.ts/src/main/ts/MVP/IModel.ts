module TS.MVP {
    export interface IModel {

        addChangeListener(listener: IModelChangeListener);

        removeChangeListener(listener: IModelChangeListener );

        addStateChangeListener(listener: IModelStateChangeListener );

        removeStateChangeListener(listener: IModelStateChangeListener );

        createStateDescription(models?:IModel[]):any;

        loadStateDescription(description: any);
    }
}