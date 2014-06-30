// Module
module TS.IJQuery.MVP.HB.Example.Label {

    // Class
    export class ImmutableLabelModel extends TS.MVP.AbstractModel implements ILabelModel {

        constructor(private _label: string) {
            super(); 
        }

        public getLabel(): string {
            return this._label;
        }

        public exportState(models?: TS.MVP.IModel[]): any {
            return this._label;
        }

        public _importState(description: any): TS.MVP.ModelStateChangeEvent[] {
            this._label = <string>description;
            return null;
        }
        
    }

}