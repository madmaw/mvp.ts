module TS.IJQuery.MVP.HB.Example.HelloYou {
    export class HelloYouModel extends TS.MVP.AbstractModel implements TS.IJQuery.MVP.HB.Example.Label.ILabelModel, TS.IJQuery.MVP.HB.Example.TextInput.ITextInputModel {

        constructor(private _name: string) {
            super();
        }

        public getLabel(): string {
            return this._name;
        }

        public getValue(): string { 
            return this._name;
        }

        public requestSubmit(value: string) {
            this._name = value;
            this._fireModelChangeEvent();
        }

        public exportState(models?: TS.MVP.IModel[]): any {
            models = this._checkModels(models);
            return this._name;
        }

        public importState(description: any, callback:TS.MVP.IModelImportStateCallback) {
            this._name = description;
            callback([]);
        }


    }

}

