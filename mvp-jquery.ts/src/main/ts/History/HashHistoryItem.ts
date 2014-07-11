﻿module TS.IJQuery.History {

    export class HashHistoryItem {


        public constructor(private _modelStateData: any, private _modelStateDataEncoded: string, private _modelStateChange: TS.MVP.IModelStateChangeOperation, public replaceId: string) {
        }

        public getModelStateData() {
            return this._modelStateData;
        }

        public getModelStateChange() {
            return this._modelStateChange;
        }

        public getModelStateDataEncoded() {
            return this._modelStateDataEncoded;
        }
    }

} 