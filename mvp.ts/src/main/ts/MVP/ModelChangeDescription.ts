// Module
module TS.MVP {

    // Class
    export class ModelChangeDescription {
        // Constructor
        constructor (private _changeType:string) { }

        public getChangeType(): string {
            return this._changeType;
        }
    }

}
