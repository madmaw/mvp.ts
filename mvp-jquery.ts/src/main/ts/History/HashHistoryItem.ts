module TS.IJQuery.History {

    export class HashHistoryItem {


        public constructor(private _modelStateData: any, private _modelStateDataEncoded: string, private _modelStateChange: TS.MVP.IModelStateChangeOperation) {
        }

        public getModelStateData() {
            return this._modelStateData;
        }

        public getModelStateChange() {
            return this._modelStateChange;
        }

        public setModelStateChange(modelStateChange: TS.MVP.IModelStateChangeOperation) {
            this._modelStateChange = modelStateChange;
        }

        public getModelStateDataEncoded() {
            return this._modelStateDataEncoded;
        }
    }

} 