module TS.MVP {
    export class ModelChangeEvent {

        private _descriptions:ModelChangeDescription[];


        constructor(_changeType?:string);
        constructor(_modelChangeDescription?:ModelChangeDescription);
        constructor(_modelChangeDescriptions?:ModelChangeDescription[]);
        constructor(data?:any){
            if (data == null) {
                this._descriptions = [];
            } else {
                if (data instanceof ModelChangeDescription) {
                    this._descriptions = [data];
                } else if (data instanceof Array) {
                    this._descriptions = data;
                } else {
                    this._descriptions = [new ModelChangeDescription(data)];
                }
            }
        }

        public lookup(changeType: string) {
            var result = null;
            for (var i in this._descriptions) {
                var description = this._descriptions[i];
                if (description.getChangeType() == changeType) {
                    result = description;
                    break;
                }
            }
            return result;
        }
    }
}