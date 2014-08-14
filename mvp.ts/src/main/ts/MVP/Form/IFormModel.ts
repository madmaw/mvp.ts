module TS.MVP.Form {

    export interface IFormModel extends IModel {

        getFieldValue(key: string): any;

        setFieldValue(key: string, value: any);

        getFieldValidationErrors(key: string): string[];

        getFormErrors(): string[];

        requestSubmit();
    }
}