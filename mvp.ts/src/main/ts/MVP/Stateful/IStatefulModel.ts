module TS.MVP.Stateful {

    export interface IStatefulModel<T> extends IModel {

        getState(): T;

    }

} 