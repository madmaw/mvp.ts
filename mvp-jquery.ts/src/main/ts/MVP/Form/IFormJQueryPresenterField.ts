module TS.IJQuery.MVP.Form {

    export interface IFormJQueryPresenterField {
        setValue(value: any);

        getValue(): any;

        setValidationErrors(validationErrors: string[]);

        setChangeCallback(changeCallback: (field: IFormJQueryPresenterField)=>void);
    }

}