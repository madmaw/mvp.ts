// Module  
module TS.IJQuery.MVP.HB.Example.HelloWorld {
    export class HelloWorldModel extends TS.MVP.AbstractModel implements TS.IJQuery.MVP.HB.Example.Label.ILabelModel {
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

