// Module
module TS.MVP {

    // Class
    export class PresenterChangeEvent {
        // Constructor
        constructor(private _modelChanged?: boolean, private _previousModel?:IModel) {
            if (this._modelChanged == null) {
                this._modelChanged = false;
            }
        }

        public getModelChanged(): boolean {
            return this._modelChanged;
        }

        public getPreviousModel() {
            return this._previousModel;
        }
    }

}

