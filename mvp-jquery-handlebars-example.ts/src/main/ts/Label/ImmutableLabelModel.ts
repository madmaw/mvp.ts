// Module
module TS.JQuery.MVP.HB.Example.Label {

    // Class
    export class ImmutableLabelModel extends TS.MVP.AbstractModel implements ILabelModel {

        constructor(private _label: string) {
            super(); 
        }

        public getLabel(): string {
            return this._label;
        }

        
    }

}