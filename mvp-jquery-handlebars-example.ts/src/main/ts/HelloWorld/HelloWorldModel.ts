// Module  
module TS.JQuery.MVP.HB.Example.HelloWorld {
    export class HelloWorldModel extends TS.MVP.AbstractModel implements TS.JQuery.MVP.HB.Example.Label.ILabelModel {
        private _name: string;

        constructor(_name: string) {
            super();
            this._name = _name;
        }

        public getLabel(): string {
            return this._name;
        }
    }
}

