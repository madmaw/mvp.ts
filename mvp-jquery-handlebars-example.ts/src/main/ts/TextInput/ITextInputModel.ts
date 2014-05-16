
// Module 
module TS.JQuery.MVP.HB.Example.TextInput {

    // Class
    export interface ITextInputModel extends TS.MVP.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}