module TS.JQuery.MVP.HB.Example.HelloYou {
    export class HelloYouModel extends TS.MVP.AbstractModel implements TS.JQuery.MVP.HB.Example.Label.ILabelModel, TS.JQuery.MVP.HB.Example.TextInput.ITextInputModel {

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

        public createStateDescription(models?: TS.MVP.IModel[]): any {
            models = this._checkModels(models);
            return this._name;
        }

        public loadStateDescription(description: any) {
            this._name = description;
        }


    }

}

