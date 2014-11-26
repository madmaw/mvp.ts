module TS.MVP {

    export class ModelStateChangeEvent {

        constructor(private _operation: IModelStateChangeOperation, private _replace?: boolean) {

        }

        public getOperation() {
            return this._operation;
        }

        /**
         * If the operation should overwrite previous operations instead of being pushed
         */
        public getReplace() {
            return this._replace;
        }

    }

} 