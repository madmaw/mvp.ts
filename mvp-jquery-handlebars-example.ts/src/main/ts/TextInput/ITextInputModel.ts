
// Module 
module TS.IJQuery.MVP.HB.Example.TextInput {

    // Class
    export interface ITextInputModel extends TS.MVP.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}