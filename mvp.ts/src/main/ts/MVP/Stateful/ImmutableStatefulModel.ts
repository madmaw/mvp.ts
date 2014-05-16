module TS.MVP.Stateful {

    export class ImmutableStatefulModel<T> extends AbstractModel implements IStatefulModel<T> {

        constructor(public _state: T) {
            super();
        }

        public getState(): T {
            return this._state;
        }

    }

} 