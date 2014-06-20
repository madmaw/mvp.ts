module TS.MVP {

    export class ModelStateChangeEvent {

        constructor(private _operation: IModelStateChangeOperation) {

        }

        public getOperation() {
            return this._operation;
        }

    }

} 