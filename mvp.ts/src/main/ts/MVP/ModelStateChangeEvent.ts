module TS.MVP {

    export class ModelStateChangeEvent {

        constructor(private _operation: IModelStateChangeOperation, private _replaceId?: string) {

        }

        public getOperation() {
            return this._operation;
        }

        /**
         * If the operation should overwrite previous operations instead of being pushed, then this should be non-null
         * @return the id of the thing that requires replacement
         */
        public getReplaceId() {
            return this._replaceId;
        }
    }

} 